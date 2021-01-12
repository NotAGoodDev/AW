/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

/* IMPORTS SISTEMA */
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

/* IMPORTS PROPIOS */
const config = require("./config");
const utils = require("./utils");
const middlewares = require("./middlewares");
const routerUsuarios = require("./routers/routerUsuarios");
const routerPreguntas = require("./routers/routerPreguntas");
const routerLogin = require("./routers/routerLogin");

const DAOUsuarios = require("./DAOUsuarios");
const DAOPreguntas = require("./DAOPreguntas");
const DAORespuestas = require("./DAORespuestas");
const DAOEtiquetas = require("./DAOEtiquetas");
const DAOVotos = require("./DAOVotos");
const { request } = require("http");
const { response } = require("express");


/* EXPRESS + EJS EN PUBLIC */
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ARCHIVOS ESTATICOS */
const staticFiles = path.join(__dirname, "public");

/* POOL */
const pool = mysql.createPool(config.mysqlConfig);

/* DAOS CON POOL*/
const daoUsuarios = new DAOUsuarios(pool);
const daoPreguntas = new DAOPreguntas(pool);
const daoRespuestas = new DAORespuestas(pool);
const daoEtiquetas = new DAOEtiquetas(pool);
const daoVotos = new DAOVotos(pool);

/* USO DE MIDDLEWARES */
app.use(express.static(staticFiles));       //RECURSOS ESTÁTICOS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares.session);

/* ARRANCAR SERVIDOR */ 
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
 });


/* CONTROLADOR */
app.use("/loginout", routerLogin);
app.use("/preguntas", routerPreguntas);
app.use("/usuarios", routerUsuarios);


app.get("/index", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    daoUsuarios.leerPorEmail(response.locals.userEmail, (err, usuario) => {
        response.render("index", { usuario: usuario[0] });
    })
});

app.get("/", middlewares.controlAcceso, function (request, response) {
    response.status(302);
    response.redirect("/index");
});