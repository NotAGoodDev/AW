"use strict"

const mysql = require("mysql");
const config = require("./config");
const DAOUsuarios = require("./src/DAOUsuarios");
//const DAOPreguntas = require("./src/DAOPreguntas");
//const DAORespuestas = require("./src/DAORespuestas");


const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUsuarios = new DAOUsuarios(pool);
//let daoPreguntas = new DAOPreguntas(pool);
//let daoRespuestas = new DAORespuestas(pool);

daoUsuarios.insertar("A@404.COM", "CONTRASEÑA", "NOMBRE", "IMAGEN", (err, result) => {
    // if (err) {
    //     console.log(err);
    // } else if( result ) {
    //     console.log("Dado de alta");
    // } else {
    //     console.log("Error en la alta");
    // }
})