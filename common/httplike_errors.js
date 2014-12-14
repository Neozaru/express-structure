
var httplike_errors = {};

httplike_errors.fromMongo = function(err) {
	var error = {code: 500};

	// Mongoose
	if (err.name) {
	    switch(err.name) {
	        case "BadRequestError":
	            error.code = 400;
	            error.message = err.message;
	            break;
	        case "ValidationError":
	        	error.code = 400;
	        	error.message = err.errors;
	        	error.type = "MongooseValidation";
	        	break;
	    }
	}

	return error;
};

module.exports = httplike_errors;