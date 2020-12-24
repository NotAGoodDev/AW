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
const DAOUsuarios = require("./DAOUsuarios");
const DAOPreguntas = require("./DAOPreguntas");
const DAORespuestas = require("./DAORespuestas");

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

/* USO DE MIDDLEWARES */
app.use(express.static(staticFiles));       //RECURSOS ESTÁTICOS
app.use(bodyParser.urlencoded({ extended: false }));

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
app.get("/RUTA/:id", function (request, response) {
    response.status(200);
    //response.status(302);
    //app.post -> request.body.parametro_de_formulario
    dao.funcion(parametro, (err, result) => {
        if(err) {
            console.warn(err);
        } else {
            response.render("EJSView", { nombreEnView: valores });
        }
    });
})

app.get("/loginout/login", function (request, response) {
    response.status(200);
    response.render("loginout/login");
})

app.get("/loginout/registro", function (request, response) {
    response.status(200);
    response.render("loginout/registro");
})

app.post("/loginout/registro", function (request, response) {
    response.status(200);

    if (utils.passCoincide(request.body.pwd, request.body.pwd2)
    && utils.passCorrecta(request.body.pwd)) {

        daoUsuarios.existe(request.body.email, (err, existe) => {

            if(!existe) {    
                let img = utils.gestionarImagen(request.body.photo, request.body.email);

                daoUsuarios.insertar(request.body.email, request.body.pwd, request.body.name, img, (err, insertado) => {
                    if(insertado) {
                        utils.informar("EL USUARIO SE HA DADO DE ALTA CON EXITO")
                        response.render("loginout/login");
                        
                    } else {
                        utils.informar("EL USUARIO NO SE HA DADO DE ALTA")
                        response.render("loginout/registro");
                    }
                })
            } else {
                utils.informar("EL USUARIO YA ESTA DADO DE ALTA");
                response.render("loginout/login");
            }
        })
    } else {
        response.render("loginout/registro");
    }
})

/* QUITAMOS ESTA VARIABLE CUANDO INICIEMOS SESIÓN */
const email = "alex@404.COM";

app.get("/index", function (request, response) {
    response.status(200);
    daoUsuarios.leerPorEmail(email, (err, usuario) => {
        if(err) {
            console.warn(err);
        } else {
            response.render("index", { usuario: usuario[0] });
        }
    });
})

app.get("/", function (request, response) {
    response.status(302);
    response.redirect("/index");
})

/* CONTROLADOR */
app.get("/usuarios/perfil/:id", function (request, response) {
    response.status(200);

    daoUsuarios.leerPorId(request.body.id, (err, result) => {
        if(err) {
            console.warn(err);
        } else {   
            response.render("perfil", { nombreEnView: valores });
        }
    });
})