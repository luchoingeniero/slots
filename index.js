var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

var HOST = '192.99.153.92';
var PORT = 1000;

var mysql      = require('mysql');
var database='xploradata_pozo_1';


function guardar(slot,valor){
  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'XXperu2016',
  database : database
});

connection.connect(function(err) {
  if(err){
    //console.log("Error en la Conexion!! a "+database);
  }else{
   // console.log("Conectado a la base de datos !!"+database)
  }
  // connected! (unless `err` is set)
});


var post  = {slot_id: slot, valor: valor};

            var query = connection.query('INSERT INTO datos SET ?', post, function(err, result) {
              connection.end();
  // Neat!
            });


}


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('Un Usuario Conectado');

});

http.listen(3000, function(){
  console.log('Esperando Clientes on *:3000');
});


net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Cliente Conectado: ' + sock.remoteAddress +':'+ sock.remotePort);
    
   // Add a 'data' event handler to this instance of socket
    sock.on('error',function(error){
      console.log("Ocurrio un error"+error.stack);
      io.emit("state server",'ERROR');
    });

    sock.on('data', function(data) {
    io.emit("state server",'ONLINE');
    console.log('DATOS RECIBIDOS ' + sock.remoteAddress + ': ' + data);
    msg=data+'';

    	msg=msg.replace("&","").replace("!","");
  		msg=msg.replace(/(\r\n|\n|\r)/gm, ";");
  		datos=msg.split(";");
  		for(var i=0;i<datos.length;i++){
  			slot=datos[i];
  			if(slot.length>4){
  				var n_slot=slot.substring(0,4).replace(".","");
  				if(n_slot.length==4){
  					var v_slot=slot.substring(4,slot.length);
  					io.emit("chat message",n_slot+':'+v_slot);
            guardar(n_slot,v_slot);
            
  							 	

  				}
  				
  			

  			}
  			
           
  		}

    

        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
      io.emit("state server",'OFFLINE');
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);

console.log('esperando datos del serial ' + HOST +':'+ PORT);