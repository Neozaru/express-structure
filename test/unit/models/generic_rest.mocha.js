var expect = require("chai").expect;

var base = "../../.."
var generic_rest = require(base+"/controllers/generic_rest");

describe('Generic Rest Model test', function() {


  beforeEach(function() {


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



});