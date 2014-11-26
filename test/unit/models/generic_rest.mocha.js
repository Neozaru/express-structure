var expect = require("chai").expect;
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

var TestModel = mongoose.model('Test', mongoose.Schema({
    astring: { type: String, required: true },
    aboolean: { type: Boolean, default: false }
  })
);

var base = "../../.."
var generic_rest = require(base+"/models/generic_functions");

/* Create in-memory db */
mockgoose(mongoose);

describe('Generic Rest Model test', function() {


  beforeEach(function() {
    mockgoose.reset(); 
  });

  it('should have initial values', function(){

  });

  describe('copyFields', function() {
    it('should process empty objects without fields', function() {

      var missing = generic_rest.copyFields({},{},[],[]);
      expect(missing).to.be.empty

    });

    it('should process empty objects with fields', function() {

      {      
        var missing = generic_rest.copyFields({},{},["foo", "bar"],[]);
        expect(missing).to.be.empty
      }

      {      
        var missing = generic_rest.copyFields({},{},["foo", "bar"],["foo"]);
        expect(missing).to.have.length(1);
        expect(missing).to.contain("foo");
      }

      {      
        var missing = generic_rest.copyFields({},{},["foo", "bar"],["other"]);
        expect(missing).to.be.empty
      }

    });

    it('should process objects without fields', function() {

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_rest.copyFields(source,target,[],[]);
        expect(missing).to.be.empty;
        expect(target).to.be.empty;
      }

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {"key": "value"};
        var missing = generic_rest.copyFields(source,target,[],[]);
        expect(missing).to.be.empty;
        expect(target).to.have.property("key", "value");
      }
      
    });

    it('should process objects with fields', function() {

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_rest.copyFields(source,target,["foo"],[]);
        expect(missing).to.be.empty
        expect(target).to.have.property("foo", "valuefoo");
      }

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_rest.copyFields(source,target,["foo", "nothere"],["nothere"]);
        expect(missing).to.have.length(1);
        expect(missing).to.contain("nothere");
        expect(target).to.have.property("foo", "valuefoo");
      }
      
    });

  });

  describe('index', function() {

    it('should', function() {
      console.log("Ok")
      generic_rest.find(TestModel,{},{})

    });
  });


});