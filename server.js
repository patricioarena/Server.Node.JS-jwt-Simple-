/*
Se utiliza express como server hibrido sirviendo archivos estaticos para el 
cliente y server no estatico para funciones de tiempo 
real. 

Se puede realizar lo mismo con dos servers o utilizando las siguientes 
librerias para utilizar node del lado del cliente. 
Browserify es una librería de Node.js, escrita por substack.
Gulp automatizar procesos.

https://carlosazaustre.es/browserify-desarrollando-tu-frontend-como-en-node-js/


Se utiiza cors para permitir el permiso para acceder a recursos seleccionados
desde un servidor, en un origen distinto (dominio).

https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS


*/

var host = '127.0.0.1';
var port = 3000;

var services = require('./config/withJwtSimple');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors')
var app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Express -> Servir archivos estáticos html, css, jpg, mp3, mp4, etc.
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/www/index.html');
});

app.get("/401.html", function (request, response) {
  response.sendFile(__dirname + '/www/static/view/401.html');
});

app.post("/", function (request, response) {
  response.sendFile(__dirname + '/www/static/view/401.html');
});

app.get("/lib/jquery/jquery.min.js", function (request, response) {
  response.sendFile(__dirname + '/www/static/lib/jquery/jquery.min.js');
});

app.get("/css/main.css", function (request, response) {
  response.sendFile(__dirname + '/www/static/css/main.css');
});

app.get("/7403845181214728642.jpg", function (request, response) {
  response.sendFile(__dirname + '/www/static/img/7403845181214728642.jpg');
});

/*

Partiendo de la premisa de que ya se verifico la existencia del
usuario en la base de datos. 

Recuperar datos de la base de datos y proveerlos con el siguiente formato;
var dataUser = {email:"email@gmail.com", pwd:"987654321", role:"User"};

*/

app.post("/login", function (require, response) {
  var userVerify = true; // aca otro servicio que verifique la existencia del usuario en la base de datos.
  var dataUser = { email: "email@gmail.com", pwd: "123", role: "User" };
  
  if (userVerify) {
    if (require.body.Token === '') {
      var token = services.createToken(require.body.email, require.body.password);
      response.status(200).send(JSON.stringify(token));
      console.log("Usuario valido, token inexistente.");
    }
    if (require.body.Token != '') {
      var newToken = services.createToken(dataUser.email, dataUser.pwd),
        codigo = services.integrityAndValidity(require.body.Token, newToken);
        
      if (codigo === -1) {
        console.log("Invalido el token fue modificado");
        response.status(401);
      }

      else if (codigo === 0) {
        console.log("Valido y resta tiempo para la expiracion.");
        response.status(200).send(JSON.stringify(require.body.Token));
      }

      else if (codigo === 1) {
        console.log("Valido y resta tiempo para la expiracion pero serca del limite, refrescar o re-enviar el mismo.");
        response.status(200).send(JSON.stringify(newToken));
      }
      
      else if (codigo === 2) {
        console.log("Valido y expirado.");
        response.status(200).send(JSON.stringify(newToken));
      }
    }
  }
});


app.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});
