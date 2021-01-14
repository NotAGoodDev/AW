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
const middlewares = require("./middlewares");
const routerUsuarios = require("./routers/routerUsuarios");
const routerPreguntas = require("./routers/routerPreguntas");
const routerLogin = require("./routers/routerLogin");
const utils = require("./utils");

const MODELUsuarios = require("./models/modelUsuarios");
const { request } = require("http");
const { response } = require("express");
const { nextTick } = require("process");


/* EXPRESS + EJS EN PUBLIC */
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ARCHIVOS ESTATICOS */
const staticFiles = path.join(__dirname, "public");

/* POOL */
const pool = utils.pool;

/* DAOS CON POOL*/
const modelUsuarios = new MODELUsuarios(pool);

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
app.get("/index", middlewares.controlAcceso, function (request, response, next) {
    response.status(200);
    modelUsuarios.leerPorEmail(response.locals.userEmail, (err, usuario) => {
        if(err) {
            response.status(500);
            next();
        } else {
            response.render("index", { usuario: usuario[0] });
            response.end();
        }
    })
});

app.get("/", middlewares.controlAcceso, function (request, response, next) {
    response.status(302);
    response.redirect("/index");
});


app.use("/loginout", routerLogin);
app.use("/preguntas", middlewares.controlAcceso, routerPreguntas);
app.use("/usuarios", middlewares.controlAcceso, routerUsuarios);
app.use(middlewares.error404);
app.use(middlewares.error500);