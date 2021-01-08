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
});

app.get("/loginout/login", function (request, response) {
    response.status(200);
    response.render("loginout/login");
});

app.get("/loginout/registro", function (request, response) {
    response.status(200);
    response.render("loginout/registro");
});

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
});

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
});

app.get("/", function (request, response) {
    response.status(302);
    response.redirect("/index");
});

app.get("/preguntas", function (request, response) {
    daoPreguntas.listarPreguntas((err, preguntas) =>{
        if(err) {
            console.warn(err);
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            daoEtiquetas.listarEtiquetas((err, etiquetas) => {
                //console.warn(preguntas);
                if(err) {
                    console.warn(err);
                } else {
                    response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas:etiquetas, titulo:"Todas las preguntas"});
                }
            });
        }
    });
});

app.post("/preguntas/busqueda", function (request, response){
    response.status(200);
    if(request.body.busqueda !== ""){
        let ruta="/preguntas/buscar/"+request.body.busqueda;
        response.redirect(ruta);
    }else{
        response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" });
    }
});



app.get("/preguntas/buscar/:id", function (request, response) {
    response.status(200);
    daoPreguntas.buscar(request.params.id, (err, preguntas) => {
        if(err) {
            console.warn(err);
        } else {
            if(preguntas.length == 0){
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" });
            }else{
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id +" ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length-1); //para quitar la ultima coma
                daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);  
                        response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas, titulo:"Resultado de las búsqueda '" + request.params.id + "'" });
                    }
                });
            }
        }
    });
});

app.get("/preguntas/sinResponder", function (request, response) {
    daoPreguntas.buscarSinRespuesta((err, preguntas) =>{
        if(err) {
            console.warn(err);
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            let etiquetasALeer = "";
            preguntas.forEach(pregunta => {
                etiquetasALeer += pregunta.id +" ,";
            });
            etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length-1); //para quitar la ultima coma
            daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                if(err) {
                    console.warn(err);
                } else {
                    preguntas = utils.reducirCuerpoA150(preguntas);  
                    response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas , titulo:"Preguntas sin responder"});
                }
            });
        }
    });
});

app.get("/preguntas/etiquetadas/:etiqueta", function (request, response) {
    daoPreguntas.leerPorEtiqueta(request.params.etiqueta, (err, preguntas) =>{
        if(err) {
            console.warn(err);
        } else {
            if(preguntas.length == 0){
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" });
            }else{
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id +" ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length-1); //para quitar la ultima coma
                daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);  
                        response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas, titulo:"Preguntas con la etiqueta [" + request.params.etiqueta + "]" });
                    }
                });
            }
        }
    });
});


app.get("/preguntas/formular", function (request, response) {
    response.render("preguntas/formular");
});

app.get("/preguntas/prueba", function (request, response) {
    response.render("/preguntas/mostrar", {});
});

app.post("/preguntas/formular/procesar", function (request, response){
    response.status(200);
    if(request.body.titulo !== "" && request.body.cuerpo !== ""){
        
            daoPreguntas.insertarPregunta(0,request.body.titulo, request.body.cuerpo, (err, rows) => {
                if(err) {
                    console.warn(err);
                } else {
                    if(request.body.etiquetas !== ""){
                        console.log("ahora a etiquetas");
                        let etiquetas = utils.procesarEtiquetas(request.body.etiquetas);
                        console.log(etiquetas);
                        etiquetas.forEach(etiqueta => {
                            daoEtiquetas.insertarEtiqueta(rows.insertId, etiqueta, (err, ok) => {
                                if(err) {
                                    console.warn(err);
                                }
                            });    
                        });
                    }
                    response.redirect("/preguntas");
                }
            });
        

    }else{
        response.render("preguntas/formular"); //hacemos algo más?
    }
});


app.get("/preguntas/vista/:id", function (request, response) {
    response.status(200);
    daoPreguntas.buscarPorId(request.params.id, (err, pregunta) => {
        if(err) {
            console.warn(err);
        } else {
            if(pregunta.length == 0){
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" });
            }else{
                daoEtiquetas.leerPorIdEtiquetas(pregunta[0].id, (err, etiquetas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        daoVotos.contarDePreguntas(pregunta[0].id, (err, n_votos) => {
                            if(err) {
                                console.warn(err);
                            } else {
                                daoRespuestas.listarRespuestas(pregunta[0].id,(err, respuestas) => {
                                    if(err) {
                                        console.warn(err);
                                    } else {
                                        response.render("preguntas/funciona", {pregunta: pregunta[0], n_votos_preg: n_votos[0].n_votos, etiquetas: etiquetas, respuestas: respuestas});
                                        /*let n_votos_resp = [];
                                        respuestas.forEach(respuesta =>{
                                            daoVotos.contarDeRespuestas(respuesta.id,(err, votos) => {
                                                if(err) {
                                                    console.warn(err);
                                                } else {
                                                    n_votos_resp.push(votos[0].n_votos);
                                                }
                                            });
                                        })*/
                                       
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

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

                                daoUsuarios.medallas(request.params.id, (err, medallas) => {
                                
                                response.render("perfil/perfil", {
                                        usuario: usuario[0],
                                        usuarioPerfil: perfil[0],
                                        medallasBronce: medallas["bronce"],
                                        medallasPlata: medallas["plata"],
                                        medallasOro: medallas["oro"]
                                    });
                                });

                            }
                        });
                    }
                });

            }
        });
    });
});





