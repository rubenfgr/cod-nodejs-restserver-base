

// ===========================================
// Puerto
// ===========================================
// @ts-ignore
process.env.PORT = process.env.PORT || 3000;



// ===========================================
// Entorno
// ===========================================

// NODE_ENV es una variable que la establece Heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ===========================================
// Base de datos
// ===========================================
let urlDB;
let user = 'rubenfgr';
let password = '4y4hEX2RVyTMU8uW';

if (process.env.NODE_ENV === 'dev') {
    urlDB = `mongodb://localhost:27017/cafe`;
} else {
    urlDB = `mongodb+srv://${ user }:${ password }@cafe-nxmxt.mongodb.net/cafe`;
}

process.env.URLDB = urlDB;


// mongoDB Atlas
// Usuario: rubenfgr
// Contraseña: 4y4hEX2RVyTMU8uW
// mongodb+srv://rubenfgr:4y4hEX2RVyTMU8uW@cafe-nxmxt.mongodb.net/cafe

// mongodb://localhost:27017/cafe