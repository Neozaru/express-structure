express-structure
=================

Express Project Structure

Created for myself. Shared on github.

Install packages
```
npm install
```

Create your start file in `bin/www`

```
#!/usr/bin/env node
var debug = require('debug')('express-structure');
var app = require('../app');
var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});

/* Not bound to database yet */
var userGetterStub = function(username, password, cb) {
    if (username == "neozaru" && password == "mypass") {
        cb(null, {"username": "neozaru"});
    }
    else {
        cb(null, false, {message: "Incorrect credentials"});
    }
    
};

/* Configures Authentication */
var passport = require('passport');
var auth = require("../config/auth");
auth.init(passport, userGetterStub, {token_secret: "xxx"});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
```


Create mongodb path
```
mkdir -p data
```

Start mongodb server with proper privileges
```
mongod --dbpath data
```


Then use `npm start` to start the server.

Automated testing :
```
npm test
```

Test with `curl` :

Create new cat
```
curl -i localhost:3000/api/cats -X POST -d 'name=lolcat' -d 'mewowed=true'
```

Retrieve cats
```
curl -i localhost:3000/api/cats
```

Get cat
```
curl -i localhost:3000/api/cats/<myid> -X PUT -d 'name=newname'
```

Note that API call responses are stubs.