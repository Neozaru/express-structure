var cats = {};

cats.index = function(req, res) {
	return res.send({"name": "My awesome resource"});
}

cats.create = function(req, res) {
	if (!req.body.name) {
		return res.status(400).send({error: "Missing 'name'"});
	}
	var resource = {"name": req.body.name};
	return res.status(201).send(resource);
}

cats.get = function(req, res) {
	var resource = {id: req.param("id"), "name": "foo"};
	return res.send(resource);
}

cats.delete = function(req, res) {
	return res.sendStatus(204);
}

cats.edit = function(req, res) {
	return res.send({});
}

module.exports = cats;