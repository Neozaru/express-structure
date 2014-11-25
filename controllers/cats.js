var generic_rest = require('./generic_rest');
/* Let caller define which model use (better architecture, esier testing) */
var catsInj = function(CatModel) {

	var cats = {};
	cats.index = function(req, res) {
		return generic_rest.index(CatModel, req, res);
	}

	cats.create = function(req, res) {
		return generic_rest.create(CatModel, ["name", "mewowed"], ["name"], req, res);
	}

	cats.get = function(req, res) {
		return generic_rest.get(CatModel, req.params.id, req, res);
	}

	cats.delete = function(req, res) {
		return generic_rest.delete(CatModel, req.params.id, req, res);
	}

	cats.edit = function(req, res) {
		return generic_rest.edit(CatModel, req.params.id, ["name", "mewowed"], req, res);
	}

	return cats;
	
}


module.exports = catsInj;