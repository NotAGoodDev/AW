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
const id_usuario = 1;

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
                    response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas:etiquetas, titulo:"Todas las preguntas", usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
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
        response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
    }
});



app.get("/preguntas/buscar/:id", function (request, response) {
    response.status(200);
    daoPreguntas.buscar(request.params.id, (err, preguntas) => {
        if(err) {
            console.warn(err);
        } else {
            if(preguntas.length == 0){
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"} });
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
                        response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas, titulo:"Resultado de las búsqueda '" + request.params.id + "'" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
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
                    response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas , titulo:"Preguntas sin responder" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
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
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
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
                        response.render("preguntas/preguntas", {preguntas: preguntas, etiquetas: etiquetas, titulo:"Preguntas con la etiqueta [" + request.params.etiqueta + "]" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
                    }
                });
            }
        }
    });
});


app.get("/preguntas/formular", function (request, response) {
    response.render("preguntas/formular",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
});


app.post("/preguntas/formular/procesar", function (request, response){
    response.status(200);
    if(request.body.titulo !== "" && request.body.cuerpo !== ""){
        
            daoPreguntas.insertarPregunta(2,request.body.titulo, request.body.cuerpo, (err, rows) => {
                if(err) {
                    console.warn(err);
                } else {
                    if(request.body.etiquetas !== ""){
                        let etiquetas = utils.procesarEtiquetas(request.body.etiquetas);
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
        response.render("preguntas/formular", {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}}); //hacemos algo más?
    }
});

app.get("/preguntas/visitas/:id", function (request, response) {
    response.status(200);
    daoPreguntas.leerVisitas(request.params.id, (err, visitas) => {
        if(err) {
            console.warn(err);
        } else {
            if(visitas[0] !== undefined){
                let visit = visitas[0].visitas +1;
                daoPreguntas.actualizarVisitas(request.params.id,visit, (err, rows) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.id);   
                    }
                }); 
            }
        }
    });
});
app.get("/preguntas/vista/:id", function (request, response) {
    response.status(200);
    daoPreguntas.buscarPorId(request.params.id, (err, pregunta) => {
        if(err) {
            console.warn(err);
        } else {
            if(pregunta.length == 0){
                response.render("preguntas/preguntas", {preguntas: [], etiquetas: [], titulo:"Ningún resultado" , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});
            }else{
                daoEtiquetas.leerPorIdEtiquetas(pregunta[0].id, (err, etiquetas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        daoVotos.contarDePreguntas(pregunta[0].id,1, (err, n_votos_pos) => {
                            if(err) {
                                console.warn(err);
                            } else {
                                daoVotos.contarDePreguntas(pregunta[0].id,0, (err, n_votos_neg) => {
                                    if(err) {
                                        console.warn(err);
                                    } else {
                                        daoRespuestas.listarRespuestas(pregunta[0].id,(err, respuestas) => {
                                            if(err) {
                                                console.warn(err);
                                            } else {
                                                let entra=false;
                                                let n_votos_resp_negativos = [];
                                                let n_votos_resp_positivos = [];
                                                respuestas.forEach((respuesta, indice, array) =>{
                                                    daoVotos.contarDeRespuestas(respuesta.id, 1,(err, votos) => {
                                                        if(err) {
                                                            console.warn(err);
                                                        } else {
                                                            n_votos_resp_positivos.push(votos[0].n_votos);
                                                            if(indice == array.length-1){
                                                                respuestas.forEach((respuesta2, indice2, array2) =>{
                                                                    daoVotos.contarDeRespuestas(respuesta2.id, 0,(err2, votos2) => {
                                                                        if(err2) {
                                                                            console.warn(err2);
                                                                        } else {
                                                                            n_votos_resp_negativos.push(votos2[0].n_votos);
                                                                            if(indice2 == array2.length-1){
                                                                                entra = true;
                                                                                response.render("preguntas/mostrar", {pregunta: pregunta[0], n_votos_preg: (n_votos_pos[0].n_votos - n_votos_neg[0].n_votos), etiquetas: etiquetas[pregunta[0].id], respuestas: respuestas, n_votos_resp_positivos:n_votos_resp_positivos, n_votos_resp_negativos:n_votos_resp_negativos , usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}} );
                                                                            }
                                                                        }
                                                                    });
                                                                })
                                                            }
                                                        }
                                                    });
                                                })
                                                setTimeout(()=>{
                                                    console.log("entro en el timeout");
                                                    if(!entra){
                                                        console.log("lanzo el render");
                                                        response.render("preguntas/mostrar", {pregunta: pregunta[0], n_votos_preg: (n_votos_pos[0].n_votos - n_votos_neg[0].n_votos), etiquetas: etiquetas[pregunta[0].id], respuestas: respuestas, n_votos_resp_positivos:n_votos_resp_positivos, n_votos_resp_negativos:n_votos_resp_negativos,  usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}});                        
                                                    }
                                                },3000);
                                            }
                                        });
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


app.get("/preguntas/votarPregunta/:idPregunta/:voto", function (request, response) {
    daoVotos.existeVotoPregunta(request.params.idPregunta, id_usuario,(err, voto) =>{
        if(err) {
            console.warn(err);
        } else {
            if(voto[0] === undefined){
                daoVotos.insertarVotoPregunta(request.params.idPregunta, id_usuario,request.params.voto,(err, voto) =>{
                    if(err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }else if(voto[0].voto == request.params.voto){
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            }else{
                daoVotos.modificarVotoPregunta(request.params.idPregunta, id_usuario,request.params.voto,(err, voto) =>{
                    if(err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
});


app.get("/preguntas/votarRespuesta/:idRespuesta/:voto/:idPregunta", function (request, response) {
    console.log("entro por lo mnos");
    daoVotos.existeVotoRespuesta(request.params.idRespuesta, id_usuario,(err, voto) =>{
        if(err) {
            console.warn(err);
        } else {
            if(voto[0] === undefined){
                console.log("insertamos");
                daoVotos.insertarVotoRespuesta(request.params.idRespuesta, id_usuario,request.params.voto,(err, voto) =>{
                    if(err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }else if(voto[0].voto == request.params.voto){
                console.log("es igual");
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            }else{
                console.log("lo cambiamos");
                daoVotos.modificarVotoRespuesta(request.params.idRespuesta, id_usuario,request.params.voto,(err, voto) =>{
                    if(err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
});



app.get("/usuarios", function (request, response) {
    daoUsuarios.listarUsuarios((err, usuarios) => {
        if(err) {
            console.warn(err);
        } else {
            let etiquetas =[];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                daoEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if(err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if(i === array.length-1){
                            response.render("usuarios/usuarios",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}, titulo:"Usuarios", usuarios:usuarios, etiquetas:etiquetas});   
                        }
                    }
                }); 
            });
            if(usuarios.length == 0){
                response.render("usuarios/usuarios",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}, titulo:"No hay usuarios", usuarios:usuarios, etiquetas:[]});   
            }
        }
    }); 
});



app.post("/usuarios/busqueda", function (request, response){
    response.status(200);
    if(request.body.busqueda !== ""){
        let ruta="/usuarios/buscar/"+request.body.busqueda;
        response.redirect(ruta);
    }else{
        response.render("usuarios/usuarios",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}, titulo:"No hay usuarios", usuarios:[], etiquetas:[]});
    }
});


app.get("/usuarios/buscar/:busqueda", function (request, response) {
    response.status(200);

    daoUsuarios.buscarUsuariosPorNombre(request.params.busqueda, (err, usuarios) => {
        if(err) {
            console.warn(err);
        } else {
            let etiquetas =[];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                daoEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if(err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if(i === array.length-1){
                            response.render("usuarios/usuarios",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}, titulo:"Usuarios filtrados por ['" + request.params.busqueda + "']", usuarios:usuarios, etiquetas:etiquetas});   
                        }
                    }
                }); 
            });
            if(usuarios.length == 0){
                response.render("usuarios/usuarios",  {usuario:{imagen: "/img/users/U1.png", nombre: "Alex"}, titulo:"No hay usuarios", usuarios:usuarios, etiquetas:[]});   
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





