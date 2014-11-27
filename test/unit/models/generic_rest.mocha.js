var expect = require("chai").expect;

var base = "../../.."
var generic_functions = require(base+"/models/generic_functions");
var mongoose = require('mongoose');
/* Creates in-memory db */
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var TestModel = mongoose.model('Test', mongoose.Schema({
    astring: { type: String, required: true },
    aboolean: { type: Boolean, default: false }
  })
);

describe('Generic Rest Model test', function() {


  beforeEach(function() {
    mockgoose.reset();
  });



  describe('copyFields', function() {
    it('should process empty objects without fields', function() {

      var missing = generic_functions.copyFields({},{},[],[]);
      expect(missing).to.be.empty

    });

    it('should process empty objects with fields', function() {

      {      
        var missing = generic_functions.copyFields({},{},["foo", "bar"],[]);
        expect(missing).to.be.empty
      }

      {      
        var missing = generic_functions.copyFields({},{},["foo", "bar"],["foo"]);
        expect(missing).to.have.length(1);
        expect(missing).to.contain("foo");
      }

      {      
        var missing = generic_functions.copyFields({},{},["foo", "bar"],["other"]);
        expect(missing).to.be.empty
      }

    });

    it('should process objects without fields', function() {

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_functions.copyFields(source,target,[],[]);
        expect(missing).to.be.empty;
        expect(target).to.be.empty;
      }

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {"key": "value"};
        var missing = generic_functions.copyFields(source,target,[],[]);
        expect(missing).to.be.empty;
        expect(target).to.have.property("key", "value");
      }
      
    });

    it('should process objects with fields', function() {

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_functions.copyFields(source,target,["foo"],[]);
        expect(missing).to.be.empty
        expect(target).to.have.property("foo", "valuefoo");
      }

      {      
        var source = {"foo": "valuefoo", "bar": "valuebar"};
        var target = {};
        var missing = generic_functions.copyFields(source,target,["foo", "nothere"],["nothere"]);
        expect(missing).to.have.length(1);
        expect(missing).to.contain("nothere");
        expect(target).to.have.property("foo", "valuefoo");
      }
      
    });

  });

  describe('database functions', function() {

    it('should find', function(done) {

      generic_functions.find(TestModel,function(err, items) {

        expect(items).to.be.empty;

        var item = new TestModel({"astring": "value1"});
        item.save(function(err) {
          var item2 = new TestModel({"astring": "value2"});
          item2.save(function(err) {

            generic_functions.find(TestModel,function(err, items) {
              expect(items).to.have.length(2);
              done();
            });
          });
          
        });
      });


    });


    it('should find by id', function(done) {

      var item = new TestModel({"astring": "value1"});
      item.save(function(err) {

          generic_functions.findById(TestModel, item.id, function(err, found_item) {
            expect(found_item).to.have.property("astring","value1");
            expect(found_item).to.have.property("id",item.id);
            done();
          });
        
      });

    });

    it('should remove by id', function(done) {

      var item = new TestModel({"astring": "value1"});
      item.save(function(err) {

          generic_functions.remove(TestModel, item.id, function(err) {
            expect(err).to.be.null;

            /* Item shouldn't exist */
            TestModel.findById(item.id, function(err,item) {
              expect(err).to.be.null;
              expect(item).to.be.null;
              done();
            });

          });
        
      });

    });



    it('should save new item', function(done) {

      generic_functions.saveNew(TestModel, {"astring": "value1"}, ["astring"], [], function(err, missing, new_item) {
        expect(missing).to.be.empty;
        expect(new_item).to.have.property("astring", "value1");
        TestModel.find(function(err, items) {
          expect(err).to.be.null;
          expect(items).to.have.length(1);
          expect(items[0]).to.have.property("astring", "value1");
          expect(items[0]).to.have.property("id", new_item.id);

          /* New test (should use promises...) */
          generic_functions.saveNew(TestModel, {}, ["astring"], ["astring"], function(err, missing, new_item) {
            expect(missing).to.be.have.length(1);
            expect(missing).to.contain("astring");
            done();
          });

        });
      });

    });

    it('should save exiting item', function(done) {

      var item = new TestModel({"astring": "value1"});
      item.save(function(err) {

          generic_functions.saveExisting(TestModel, item.id, {"astring": "other_value"}, ["astring"], function(err, edited_item) {
            expect(edited_item).to.have.property("astring","other_value");
            expect(edited_item).to.have.property("id",item.id);

            /* New one */
            TestModel.findById(item.id, function(err, found_item) {
              expect(err).to.be.null;
              expect(found_item).to.have.property("astring","other_value");
              expect(found_item).to.have.property("id",item.id);
              done();
            });

          });
        
      });

    });

  });


});