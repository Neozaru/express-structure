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

generic.index = function(Model, req, res) {
    return Model.find(function(err, items) {
        return err ? res.sendStatus(500) : res.send(items);
    });
}

generic.create = function(Model, fields, required, req, res) {
    
    var item = new Model();
    var missing = generic.copyFields(req.body, item, fields, required);
    if (!_.isEmpty(missing)) {
        return res.status(400).send({"error": {"missing": missing}});
    }

    item.save(function(err) {
        return err ? res.sendStatus(500) : res.status(201).send(item);
    });
}

generic.get = function(Model, id, req, res) {
    return Model.findById(id, function(err, item) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        return item ? res.send(item) : res.sendStatus(404);
        
    });
}

generic.delete = function(Model, id, req, res) {
    return Model.findById(req.params.id, function(err, item) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        return item.remove(function(err) {
            return  res.sendStatus(err ? 500 : 202)
        });

    });
}

generic.edit = function(Model, id, fields, req, res) {
    return Model.findById(id, function(err, item) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        generic.copyFields(req.body, item, fields, []);

        return item.save(function(err) {
            return  err ? res.sendStatus(500) : res.send(item);
        });

    });
}



module.exports = generic;