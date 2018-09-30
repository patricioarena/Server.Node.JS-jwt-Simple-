
module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || "claveUltraSecretaXD",

    PAYLOAD: process.env.PAYLOAD || {
      
      iss: "myDomain",
      sub: "email@gmail.com",
      iat: 0,
      exp: 1,
      "pwd":"123456",
      "role": "User"
      
    }

  };