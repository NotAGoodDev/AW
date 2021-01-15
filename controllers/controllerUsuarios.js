/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

const utils = require("../utils");
const pool = utils.pool;
const path = require("path");

const MODELUsuarios = require("../models/modelUsuarios");
const MODELPreguntas = require("../models/modelPreguntas");
const MODELRespuestas = require("../models/modelRespuestas");
const MODELEtiquetas = require("../models/modelEtiquetas");

const modelUsuarios = new MODELUsuarios(pool);
const modelPreguntas = new MODELPreguntas(pool);
const modelRespuestas = new MODELRespuestas(pool);
const modelEtiquetas = new MODELEtiquetas(pool);


function listarUsuarios(request, response, next) {
    modelUsuarios.listarUsuarios((err, usuarios) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (usuarios.length == 0) {
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "No hay usuarios",
                    usuarios: usuarios
                });
            } else {
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "Usuarios",
                    usuarios: usuarios
                });
            }
        }
    });
}

function imagenPerfil(request, response, next) {
    response.status(200);
    modelUsuarios.imagen(response.locals.userEmail, function (err, image) {
        if (err) {
            response.status(500);
            next();
        } else {
            let ruta = path.join(__dirname, "../profile_imgs/", image);
            response.sendFile(ruta);
        }
    })
}

function imagenPorId(request, response, next) {
    response.status(200);
    modelUsuarios.leerPorId(request.params.id, function (err, usuario) {
        if (err) {
            response.status(500);
            next();
        } else {
            modelUsuarios.imagen(usuario[0].email, function (err, image) {
                if (err) {
                    response.status(500);
                    next();
                } else {    //Siempre tiene imagen
                    let ruta = path.join(__dirname, "../profile_imgs/", image);
                    response.sendFile(ruta);
                }
            })
        }
    })
}

function buscar(request, response, next) {
    response.status(200);
    if (request.body.busqueda !== "") {
        let ruta = "/usuarios/buscar/" + request.body.busqueda;
        response.redirect(ruta);
    } else {
        response.render("usuarios/usuarios", {
            nombre: response.locals.nombre,
            titulo: "No hay usuarios",
            usuarios: [],
            etiquetas: []
        });
    }
}

function buscarPorNombre(request, response, next) {
    response.status(200);

    modelUsuarios.listarUsuarios((err, usuarios) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (usuarios.length == 0) {
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "No hay usuarios",
                    usuarios: usuarios
                });
            } else {
                let u = usuarios.filter( usuario => {
                    if(usuario.nombre.toLowerCase()
                    .includes(request.params.busqueda.toLowerCase())) {
                        return usuario;
                    }
                })
                
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "Usuarios filtrados por ['" + request.params.busqueda + "']",
                    usuarios: u
                });
            }
        }
    });
}

function mostrarPerfil(request, response, next) {
    response.status(200);

    modelUsuarios.leerPorEmail(response.locals.userEmail, (err, usuario) => {
        modelUsuarios.leerPorId(request.params.id, (err, perfil) => {
            if (err) {
                console.warn(err);
                response.status(500);
                next();
            } else {
                perfil[0].fecha_alta = perfil[0].fecha_alta.toLocaleDateString();

                modelPreguntas.contar(request.params.id, (err, preguntas) => {
                    if (err) {
                        console.warn(err);
                        response.status(500);
                        next();
                    } else {

                        perfil[0].n_preguntas = preguntas[0].n_preguntas;

                        modelRespuestas.contar(request.params.id, (err, respuestas) => {
                            if (err) {
                                console.warn(err);
                                response.status(500);
                                next();
                            } else {
                                perfil[0].n_respuestas = respuestas[0].n_respuestas;

                                modelUsuarios.medallas(request.params.id, (err, medallas) => {
                                    if (err) {
                                        console.warn(err);
                                        response.status(500);
                                        next();
                                    } else {
                                        response.render("perfil/perfil", {
                                            usuario: usuario[0],
                                            usuarioPerfil: perfil[0],
                                            medallasBronce: medallas["bronce"],
                                            medallasPlata: medallas["plata"],
                                            medallasOro: medallas["oro"]
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

module.exports = {
    listarUsuarios,
    imagenPerfil,
    imagenPorId,
    buscar,
    buscarPorNombre,
    mostrarPerfil
}