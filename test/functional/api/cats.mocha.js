var sequence = require('futures').sequence();
var request = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
/* Creates in-memory db and mocks mongoose globally */
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var app = require("../../../app");

describe('Generic Rest Model test', function() {

  beforeEach(function() {
    mockgoose.reset();
  });

  describe('Cats API', function() {
    it('should get existing cats', function(done) {

        /* I saw the future */
        sequence.then(function(next) {
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
            .end(done)
        });
    });

  });
});
