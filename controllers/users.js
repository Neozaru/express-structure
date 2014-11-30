var generic_rest = require('./generic_rest');
/* Let caller define which model use (better architecture, esier testing) */
var usersInj = function(UserModel) {

    var users = {};
    users.index = function(req, res) {
        return generic_rest.index(UserModel, req, res);
    }

    users.create = function(req, res) {
        var user = new UserModel({
            username: req.body.username,
            email: req.body.email
        });
        UserModel.register(user, req.body.password, function(err, new_user) {
            if (err) {
                if (err.name) {
                    switch(err.name) {
                        case "BadRequestError":
                            return res.status(400).send(err);
                            break;
                    }
                }
                return res.status(500).send(err);
            }
            return res.send(new_user)
        });
    }

    users.get = function(req, res) {
        return generic_rest.get(UserModel, req.params.userid, req, res);
    }

    users.delete = function(req, res) {
        if (req.user._id != req.params.userid) {
            return res.sendStatus(401);
        }
        return generic_rest.delete(UserModel, req.params.userid, req, res);
    }

    users.edit = function(req, res) {
        if (req.user._id != req.params.userid) {
            return res.sendStatus(401);
        }
        return generic_rest.edit(UserModel, req.params.userid, ["username", "email"], req, res);
    }

    return users;
    
}


module.exports = usersInj;