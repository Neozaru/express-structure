var expect = require("chai").expect;

var base = "../../.."
var UserModel = require(base+"/models/user");
var mongoose = require('mongoose');
/* Creates in-memory db */
var mockgoose = require('mockgoose');
mockgoose(mongoose);


describe('User model test', function() {
  this.timeout(5000);

  beforeEach(function() {
    mockgoose.reset();
  });



  describe('invalid inputs', function() {

    /* No username */
    it('should fail if no username', function(done) {
      UserModel.register({"email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.not.null;
        done();
      });
    });

    /* No email */
    it('should fail if no email', function(done) {
      UserModel.register({"username": "neozaru"}, "mypassword", function(err, new_user) {
        expect(err).to.be.not.null;
        done();
      });
    });

    /* Empty password */
    it('should fail if empty password', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "", function(err, new_user) {
        expect(err).to.be.not.null;
        done();
      });
    });

    /* Weak password */
    it('should fail if empty password', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "abc", function(err, new_user) {
        expect(err).to.be.not.null;
        done();
      });
    });

  });

  describe('register/authenticate', function() {

    it('should add unactivated user', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;
        expect(new_user).to.have.property("username", "neozaru");
        expect(new_user).to.have.property("activated", false);
        expect(new_user).to.have.property("email", "neozaru@foo.org");
        expect(new_user).to.have.property("hash");
        expect(new_user).to.have.property("salt");

        UserModel.findOne({username: "neozaru"}, function(err, user) {
          expect(user).to.have.property("username", "neozaru");
          expect(user).to.have.property("activated", false);
          expect(user).to.have.property("email", "neozaru@foo.org");
          expect(user).to.have.property("hash");
          expect(user).to.have.property("salt");
          done();
        });
      });
    });

    it('should authenticate when good password', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;

        UserModel.findOne({username: "neozaru"}, function(err, user) {
          user.authenticate("mypassword", function(err, user) {
            expect(err).to.be.null;
            expect(user).to.have.property("username", "neozaru");
            done();
          });
        });
      });
    });

    it('should not authenticate when bad password', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;

        UserModel.findOne({username: "neozaru"}, function(err, user) {
          user.authenticate("badpass", function(err, user) {
            expect(err).to.be.null;
            expect(user).to.not.be;
            done();
          });
        });
      });
    });

  });

  describe('tokens : activation requests', function() {

    it('should request activation properly', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;
        expect(new_user.token).to.be.undefined;

        /* Activation function returns the user */
        UserModel.requestActivation(new_user.id, function(err, user) {
          expect(err).to.be.null;
          expect(user).to.have.property("token");
          expect(user.token).to.not.be.empty;

          /* User has been saved */
          UserModel.findOne({username: "neozaru"}, function(err, found_user) {
            expect(found_user).to.have.property("token", user.token);
            done();
          });

        });

      });
    });

    it('should not request activation if already activated', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org", "activated": true}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;
        expect(new_user.token).to.be.undefined;

        /* Activation function returns the user */
        UserModel.requestActivation(new_user.id, function(err, user) {
          expect(err).to.be.not.null;
          done();

        });

      });
    });

  });

  describe('tokens : activation validation', function() {
    it('should activate account with proper token', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;

        /* Activation function returns the user */
        UserModel.requestActivation(new_user.id, function(err, user) {
          expect(err).to.be.null;

          UserModel.activate(new_user.id, user.token, function(err, activated_user) {
            expect(err).to.be.null;
            expect(activated_user).to.have.property("activated", true);
            expect(activated_user.token).to.be.undefined;

            /* User has been saved */
            UserModel.findOne({username: "neozaru"}, function(err, found_user) {
              expect(found_user).to.have.property("activated", true);
              expect(found_user.token).to.be.undefined;
              done();
            });
          });

        });

      });
    });

    it('should not activate account with bad token', function(done) {
      UserModel.register({"username": "neozaru", "email": "neozaru@foo.org"}, "mypassword", function(err, new_user) {
        expect(err).to.be.null;

        /* Activation function returns the user */
        UserModel.requestActivation(new_user.id, function(err, user) {
          expect(err).to.be.null;

          UserModel.activate(new_user.id, "BADTOKEN", function(err, activated_user) {
            expect(err).to.be.not.null;
            done();
          });

        });

      });
    });


  });

});
