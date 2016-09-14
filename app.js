var express = require('express');
var app = require('express')();
var http = require('http');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/protected', function (req, res) {
    res.sendFile(__dirname + '/protected/index.html');
});

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/public-assets', express.static(__dirname + '/public/assets/'));
app.use('/protected-assets', express.static(__dirname + '/protected/assets/'));
