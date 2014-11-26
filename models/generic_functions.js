var _ = require('underscore');

var generic = {};

generic.copyFields = function(source, target, fields, required) {
    if (_.isEmpty(fields)) {
        return [];
    }

    return _.filter(fields, function(field) {
        if (!_.isUndefined(source[field])) {
            target[field] = source[field];
        }
        else if (_.contains(required,field)) {
            return field;
        }
    });
}

/* DB methods */
generic.find = function(Model, cb) {
    return Model.find(function(err, items) {
        return cb(err, items);
    }); 
}

generic.findById = function(Model, id, cb) {
    return Model.findById(id, function(err, item) {
        cb(err, item);
    });
}

generic.saveNew = function(Model, obj, fields, required, cb) {
    var item = new Model();
    var missing = generic.copyFields(obj, item, fields, required);
    if (!_.isEmpty(missing)) {
        return cb(null, missing, null);
    }

    item.save(function(err) {
        return cb(err, [], item);
    });
}

generic.remove = function(Model, id, cb) {
    return generic.findById(Model, id, function(err, item) {

        if (err) {
            cb(err);
        }

        return item.remove(function(err) {
            return cb(err);
        });

    });
}

generic.saveExisting = function(Model, id, obj, fields, cb) {
    return generic.findById(Model, id, function(err, item) {
        if (err) {
            cb(err)
        }

        generic.copyFields(obj, item, fields, []);

        return item.save(function(err) {
            return cb(err, item);
        });

    });
}

module.exports = generic;