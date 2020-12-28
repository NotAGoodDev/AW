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
const DAOEtiquetas = require("./DAOEtiquetas");

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
    //app.post -> request.params.parametro_de_formulario
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

    daoUsuarios.leerPorEmail(email, (err, usuario) => {
        daoUsuarios.leerPorId(request.params.id, (err, perfil) => {
            if(err) {
                console.warn(err);
            } else {
                perfil[0].fecha_alta = perfil[0].fecha_alta.toLocaleDateString();

                daoPreguntas.contar(request.params.id, (err, preguntas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        
                        perfil[0].n_preguntas = preguntas[0].n_preguntas;

                        daoRespuestas.contar(request.params.id, (err, respuestas) => {
                            if(err) {
                                console.warn(err);
                            } else {
                                perfil[0].n_respuestas = respuestas[0].n_respuestas;

                                response.render("perfil/perfil", {
                                    usuario: usuario[0],
                                    usuarioPerfil: perfil[0]
                                });
                            }
                        });
                    }
                });

            }
        });
    });
});

app.get("/preguntas", function (request, response) {
    daoPreguntas.listarPreguntas((err, preguntas) =>{
        if(err) {
            console.warn(err);
        } else {
            daoEtiquetas.listarEtiquetas((err, etiquetas) => {
                if(err) {
                    console.warn(err);
                } else {
                    response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas:etiquetas});
                }
            });
        }
    });
})



