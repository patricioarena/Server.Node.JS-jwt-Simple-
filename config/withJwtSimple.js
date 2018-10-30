/*
https://jwt.io/

http://momentjs.com/ 
Libreria manejo de fechas

https://www.cdmon.com/es/conversor-timestamp
Por medio de esta herramienta podrá convertir 
fechas en formato de tiempo de UNIX a un formato 
comprensible asi como convertir una fecha dada en 
días, meses y años a tiempo 


Datos Tecnicos

Por defecto el metodo encode utiliza HS256
pero soporta HS256, HS384, HS512 and RS256.

Si se desea codificar o decodificar con
otro algoritmo se debe agrega el mismo de 
la siguiente manera:

      jwt.encode(payload, secretKey, 'HS512')
      jwt.decode(token, secretKey, 'HS512')

De manera predeterminada se verifica la firma del token.

Estructura del payload:
  iss: Identifica al emisor del token.
  sub: Identifica el sujeto del token, por ejemplo un identificador de usuario.
  iat: Identifica la fecha de creación del token. En formato de tiempo UNIX.
  exp: Identifica a la fecha de expiración del token. Podemos calcularla a partir 
    del iat. También en formato de tiempo UNIX. 5 minuto aproximadamente.
  "role": Identifica el role del portador del token.


*/

var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');


// var dataUser = {email:"appa.software.co@gmail.com", pwd:"987654321", role:"User"};


exports.createToken = function (param1, param2) {
  var payload = config.PAYLOAD;
  payload.sub = param1;
  payload.pwd = param2;
  payload.iat = moment().unix();
  payload.exp = moment().add(0.1, "hour").unix();
  return jwt.encode(config.PAYLOAD, config.TOKEN_SECRET);
};


exports.decodeToken = function (token) {
  return jwt.decode(token, config.TOKEN_SECRET);
};

exports.integrityAndValidity = function (token, newToken2) {
  var newToken = newToken2,
    splitToken1 = newToken.split("."),
    oldToken = token,
    splitToken2 = oldToken.split(".");
  if (splitToken1.length != splitToken2.length) {
    return -1;  // Modificacion no definida en el token.
  }
  else if (splitToken1[0] != splitToken2[0]) {
    return -1;  // Modificacion en la primer parte del token.
  }
  try {
    var tokenInPage = jwt.decode(token, config.TOKEN_SECRET),
      tokenInServer = jwt.decode(newToken, config.TOKEN_SECRET);
    if (checkParts(tokenInServer, tokenInPage)) {
      temp = tokenInPage.exp - tokenInPage.iat;
      if ((temp >= 0) && (temp <= 240)) {
        return 1;
      }
      else if ((temp >= 240) && (temp <= 360)) {
        return 0;
      }
    }
  } catch (error) {
    if (error == "Error: Token expired") {
      return 2;
    }
    else if (error == "Error: Signature verification failed") {
      return -1;  // Modificacion en la segunda o tercer parte del token.
    }
    else {
      return -1;  // Modificacion en la segunda o tercer parte del token.
    }
  }
}

function getParts(json) { // Metodo para extraer los primeros 4 key con sus respectivos value de un json y retornar un nuevo objecto
  var cantidadDeparametrosAcomparar = 4;
  collection = [];
  var cont = 0;
  for (const key in json) {
    collection.push(key), collection.push(json[key]);
    cont = cont + 1;
    if (cont === cantidadDeparametrosAcomparar) {
      break;
    }
  }
  return collection;
}

function checkParts(jsonA, jsonB) { // Metodo para comparar que dos objetos (array) son iguales 
  var arrayA = getParts(jsonA);
  var arrayB = getParts(jsonB);
  var coincidencia = 0;
  for (var i = 0; i < arrayA.length; i++) {
    if (arrayA[i] === arrayB[i]) {
      coincidencia = coincidencia + 1;
    }
  }
  if (coincidencia === arrayA.length) {
    return true;
  }
  return false;
}
