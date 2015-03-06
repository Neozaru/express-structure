var futures = require('futures');
var request = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
/* Creates in-memory db and mocks mongoose globally */
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var app = require("../../../app")();

describe('Generic Rest Model test', function() {

  beforeEach(function() {
    mockgoose.reset();
  });

  describe('Cats API', function() {

    it('should create and get existing cats', function(done) {
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .get('/api/cats')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect({})
          .end(next);
      })
      .then(function(next) {
        request(app)
          .post('/api/cats')
          .send({"name": "mycat1"})
          .expect(200)
          .end(next);
      })
      .then(function(next) {
        request(app)
          .post('/api/cats')
          .send({"name": "mycat2", "mewowed": true})
          .expect(200)
          .end(next);
      })
      .then(function(next) {
        request(app)
          .get('/api/cats')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.have.property("name", "mycat1");
            expect(res.body[0]).to.have.property("mewowed", false);
            expect(res.body[1]).to.have.property("name", "mycat2");
            expect(res.body[1]).to.have.property("mewowed", true);
          })
          .end(done);
      });
    });

    it('should get cat by id', function(done) {
      var catid;
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/cats')
          .send({"name": "mycat1"})
          .expect(201)
          .expect(function(res) {
            catid = res.body._id;
          })
          .end(next);
      })
      .then(function(next) {
        request(app)
          .get('/api/cats/'+catid)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
            expect(res.body).to.have.property("name", "mycat1");
            expect(res.body).to.have.property("mewowed", false);
          })
          .end(done);
      });
    });

    it('should delete cat properly', function(done) {
      var catid;
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/cats')
          .send({"name": "mycat1"})
          .expect(201)
          .expect(function(res) {
            catid = res.body._id;
          })
          .end(next);
      })
      .then(function(next) {
        request(app)
          .delete('/api/cats/'+catid)
          .expect(202)
          .end(next);
      })
      .then(function(next) {
        request(app)
          .get('/api/cats/'+catid)
          .expect(404)
          .end(done);
      });
    });

    it('should change cat', function(done) {
      var catid;
      /* I saw the future */
      futures.sequence().then(function(next) {
        request(app)
          .post('/api/cats')
          .send({"name": "mycat1"})
          .expect(201)
          .expect(function(res) {
            catid = res.body._id;
          })
          .end(next);
      })
      .then(function(next) {
        request(app)
          .put('/api/cats/'+catid)
          .send({"name": "mycatchanged", "mewowed": true})
          .expect(200)
          .end(next);
      })
      .then(function(next) {
        request(app)
          .get('/api/cats/'+catid)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
            expect(res.body).to.have.property("name", "mycatchanged");
            expect(res.body).to.have.property("mewowed", true);
          })
          .end(done);
      });
    });

    it('shouldn\'t find unexisting cat', function(done) {
      /* I saw the future */
      request(app)
        .get('/api/cats/5478e1487b821bf1177bfc11')
        .expect(404)
        .end(done);
    });

    it('shouldn\'t delete unexisting cat', function(done) {
      /* I saw the future */
      request(app)
        .delete('/api/cats/5478e1487b821bf1177bfc11')
        .expect(404)
        .end(done);

    });

  });
});
