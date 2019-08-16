var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

var HOST = '127.0.0.1';

var PORT_SOCKET=3002;




app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});




io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets');
  //socket.emit('messages', mensaje);

  socket.on('new-message', function(data) {
  	console.log("Data recibida");
    io.sockets.emit('messages', data);
  });
});

http.listen(PORT_SOCKET, function(){
  console.log('Esperando Clientes on '+HOST+':'+PORT_SOCKET);
});


