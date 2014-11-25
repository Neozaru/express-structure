express-structure
=================

Express Project Structure

Created for myself. Shared on github.

Install packages
  npm install

Create your start file in `bin/www`

```
#!/usr/bin/env node
var debug = require('debug')('express-structure');
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
```

Then use `npm start` to start the server.


Test with `curl` :
  curl -i localhost:3000/api/cats

Note that API call responses are stubs.