var winston = require('winston');

var generic_functions = require("../models/generic_functions");

var generic = {};


generic.index = function(Model, req, res) {
    return generic_functions.find(Model, function(err, items) {
        if (err) {
            winston.error(err);
            res.sendStatus(500);
        }
        
        return res.send(items);  
        
    });
}

generic.create = function(Model, fields, required, req, res) {
    generic_functions.saveNew(Model, req.body, fields, required, function(err, missing, item) {
        if (!_.isEmpty(missing)) {
            return res.status(400).send({"error": {"missing": missing}});
        }

        if (err) {
            winston.error(err);
            res.sendStatus(500);
        }
        
        return res.status(201).send(item);  
        
    });
}

generic.get = function(Model, id, req, res) {
    return generic_functions.findById(Model, id, function(err, item) {
        if (err) {
            winston.error(err);
            return res.sendStatus(500);
        }

        return item ? res.send(item) : res.sendStatus(404);
        
    });
}

generic.delete = function(Model, id, req, res) {
    return generic_functions.remove(Model, id, function(err) {
        if (err) {
            winston.error(err);
            return res.sendStatus(500);
        }
        return res.sendStatus(202)
    });

}

generic.edit = function(Model, id, fields, req, res) {
    return generic_functions.saveExisting(Model, id, req.body, fields, function(err, item) {
        if (err) {
            winston.error(err);
            res.sendStatus(500);
        }
        
        return res.send(item);  
        
    });
}



module.exports = generic;