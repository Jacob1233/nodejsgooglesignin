"use strict";
var request = require('request');
var express = require('express');
var app = require('express')();
var https = require('https');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var privateKey = fs.readFileSync('jacobs-key.pem');
var certificate = fs.readFileSync('jacobs-cert.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(8080);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

let CLIENT_ID = '736807524112-fl28n29p67sl10edkkoll272go41l5kr.apps.googleusercontent.com'; // google app client id

io.on('connection', function (socket) {

    socket.on('verify id_token', function (id_token) {
        verifyToken(id_token, socket);
    });

});

function verifyToken(id_token, socket) {
    request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var js = JSON.parse(body);
            var aud = js.aud;
            if (verifyClientID(aud) == false) {
                var msg = `Error. Security cannot be established.`;
                socket.emit('message', msg);
            } else {
                var msg = `${js.sub} successfully signed in`;
                socket.emit('message', msg);
            }
        }
    });
}

function verifyClientID(aud) {
    if (aud == CLIENT_ID) {
        return true;
    }
    return false;
}
