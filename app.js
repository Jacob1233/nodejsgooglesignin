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

socket.on('verify id_token', function(id_token){
    verifyToken(id_token);
  });

function verifyToken(id_token) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        // console.log(xhr.responseText);

        var js = JSON.parse(xhr.responseText);
        var aud = js.aud;
        if (verifyClientID(aud) == false){
            console.log('client_id could not be verified')
        }
    };
    xhr.send('idtoken=' + id_token);
}

function verifyClientID(aud) {
    var client_id = '736807524112-fl28n29p67sl10edkkoll272go41l5kr.apps.googleusercontent.com';

    if (aud == client_id) {
        return true;
    }
    return false;
}
