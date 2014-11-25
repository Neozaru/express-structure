/* Let caller define which model use (better architecture, esier testing) */
var catsInj = function(CatModel) {

	var cats = {};
	cats.index = function(req, res) {
		return CatModel.find(function(err, cats) {
			return err ? res.sendStatus(500) : res.send(cats);
		});
	}

	cats.create = function(req, res) {
		if (!req.body.name) {
			return res.status(400).send({error: "Missing 'name'"});
		}
		
		var cat = new CatModel({
			name: req.body.name
		});

		cat.save(function(err) {
			return err ? res.sendStatus(500) : res.status(201).send(cat);
		});
	}

	cats.get = function(req, res) {
		return CatModel.findById(req.params.id, function(err, cat) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			return cat ? res.send(cat) : res.sendStatus(404);
			
		});
	}

	cats.delete = function(req, res) {
		return CatModel.findById(req.params.id, function(err, cat) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
	
			return cat.remove(function(err) {
				return  res.sendStatus(err ? 500 : 202)
			});
	
		});
	}

	cats.edit = function(req, res) {
		return CatModel.findById(req.params.id, function(err, cat) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			if (req.body.name) {
				cat.name = req.body.name;
			}
			if (req.body.mewowed) {
				cat.mewowed = req.body.mewowed;
			}
	
			return cat.save(function(err) {
				return  err ? res.sendStatus(500) : res.send(cat);
			});
	
		});
	}

	return cats;
	
}


module.exports = catsInj;