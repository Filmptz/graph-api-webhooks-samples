/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var bodyParser = require('body-parser');
 const EventEmitter = require("eventemitter3")
 const igMessageRoute = require('./controller')
 var express = require('express');
 var app = express();
 var xhub = require('express-x-hub');
 
 app.set('port', (process.env.PORT || 8080));
 
 app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
 app.use(bodyParser.json());

 app.use('',igMessageRoute)

 app.listen(app.get('port'));