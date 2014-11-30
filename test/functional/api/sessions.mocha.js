var futures = require('futures');
var request = require('supertest');
var expect = require('chai').expect;
var jwt = require('jsonwebtoken');
var userGetterStub = function(username, password, cb) {
    if (username == "neozaru" && password == "mypass") {
        cb(null, {"username": "neozaru"});
    }
    else {
        cb(null, false, {message: "Incorrect credentials"});
    }
    
};

/* Configures Authentication */
var passport = require('passport');
var auth = require("../../../config/auth");
auth.init(passport, userGetterStub, {token_secret: "xxx", expiresInMinutes: 43200});

var app = require("../../../app");


describe('Authentication tests', function() {

    describe('Initial local authentication', function() {

    it('should refuse wrong username/password', function(done) {
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/sessions')
          .send({username: "neozaru"})
          .expect(400)
          .end(next);
      })
      .then(function(next) {
        request(app)
          .post('/api/sessions')
          .send({password: "mypass"})
          .expect(400)
          .end(done);
      });
    });


    it('should refuse wrong parameters', function(done) {
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/sessions')
          .send({username: "foo", password: "bar"})
          .expect(401)
          .end(done);
      });
    });

    it('should accept correct credentials', function(done) {
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/sessions')
          .send({username: "neozaru", password: "mypass"})
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body.token);
            var data = jwt.decode(res.body.token, "xxx");
            expect(data).to.have.property("username", "neozaru");
            expect(data).to.have.property("iat");
            expect(data).to.have.property("exp");
            /* 30-days token */
            expect(data.exp-data.iat).to.equal(43200*60);
          })
          .end(done);
      });
    });

  });

  describe('Token authentication', function() {

    it('should refuse no-token', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .get('/api/sessions')
          .expect(401)
          .end(done);
      });
    });

    it('should refuse wrong-token format', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .get('/api/sessions')
          /* Missing a char in header */
          .set("Authorization", "Bearer " + "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmVvemFydSJ9.svzdcQYuXU5o8uz1iLcGZPKUIYor6ACUaZl7Q4KU82w")
          .expect(500) /* Not really a server-side error but */
          .end(done);
      });
    });

    it('should accept valid token', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .get('/api/sessions')
          .set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmVvemFydSJ9.svzdcQYuXU5o8uz1iLcGZPKUIYor6ACUaZl7Q4KU82w")
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({user: {name: "neozaru"}})
          .end(done);
      });
    });

  });

  describe('Token refresh', function() {

    it('should refuse no-token', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .put('/api/sessions')
          .expect(401)
          .end(done);
      });
    });

    it('should refuse wrong-token format', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .put('/api/sessions')
          /* Missing a char in header */
          .set("Authorization", "Bearer " + "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmVvemFydSJ9.svzdcQYuXU5o8uz1iLcGZPKUIYor6ACUaZl7Q4KU82w")
          .expect(500) /* Not really a server-side error but */
          .end(done);
      });
    });

    it('should refuse expired token', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .put('/api/sessions')
          /* Missing a char in header */
          .set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmVvemFydSIsImlhdCI6MTMxNzM3NDgxOCwiZXhwIjoxMzE3NDYxMjE4fQ.V1Jp_Q7CLcK1nttNcYTQ5IUXxdxhW5qTbR45IorHZpE")
          .expect(500) /* Not really a server-side error but */
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.have.property("name", "TokenExpiredError");
          })
          .end(done);
      });
    });

    it('should accept valid token', function(done) {
        var current_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmVvemFydSJ9.svzdcQYuXU5o8uz1iLcGZPKUIYor6ACUaZl7Q4KU82w";
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .put('/api/sessions')
          .set("Authorization", "Bearer " + current_token)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body.token);
            expect(res.body.token).to.not.eql(current_token);
            var data = jwt.decode(res.body.token, "xxx");
            expect(data).to.have.property("name", "neozaru");
            expect(data).to.have.property("iat");
            expect(data).to.have.property("exp");
            /* 30-days token */
            expect(data.exp-data.iat).to.equal(43200*60);
          })
          .end(done);
      });
    });

  });

});
