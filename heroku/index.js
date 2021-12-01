/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

 var bodyParser = require('body-parser');
 const EventEmitter = require("eventemitter3")
 var express = require('express');
 var app = express();
 var xhub = require('express-x-hub');
 
 app.set('port', (process.env.PORT || 8080));
 app.listen(app.get('port'));
 
 app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
 app.use(bodyParser.json());
 
 var token = process.env.TOKEN || 'token';
 var received_updates = [];

 const emitter = new EventEmitter()
 
 app.get('/', function(req, res) {
  
  //  res.writeHead(200, {
  //    Connection: 'keep-alive',
  //    'Content-Type': 'text/event-stream',
  //    'Cache-Control': 'no-cache'
  //  })
  //  res.write(`Start Streaming Message\n\n`)

  //  const onMessage = data => {
  //    res.write(`data: ${JSON.stringify({
  //     sender: data.entry[0].messaging[0].sender.id,
  //     msg: data.entry[0].messaging[0].message,
  //     timestamp: data.entry[0].messaging[0].timestamp
  //    })}\n\n`)
  //  }
  //  emitter.on('message', onMessage)
 
  //  req.on('close', function() {
  //    emitter.removeListener('message', onMessage)
  //  })
 
   res.send(`data: ${JSON.stringify(received_updates, null, 2)}\n\n`)
 });
 
 app.get(['/facebook', '/instagram'], function(req, res) {
   if (
     req.query['hub.mode'] == 'subscribe' &&
     req.query['hub.verify_token'] == token
   ) {
     res.send(req.query['hub.challenge']);
   } else {
     res.sendStatus(400);
   }
 });
 
 app.post('/facebook', function(req, res) {
   console.log('Facebook request body:', req.body);
 
   if (!req.isXHubValid()) {
     console.log('Warning - request header X-Hub-Signature not present or invalid');
     res.sendStatus(401);
     return;
   }
 
   console.log('request header X-Hub-Signature validated');
   // Process the Facebook updates here
   received_updates.unshift(req.body);
   res.sendStatus(200);
 });
 
 app.post('/instagram', function(req, res) {
   console.log('Instagram request body:');
   console.log(req.body);
   // Process the Instagram updates here
   //emitter.emit('message', req.body)
   received_updates.unshift(req.body);
   res.sendStatus(200);
 });
 
 app.listen();