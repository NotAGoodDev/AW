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


function listarUsuarios(request, response) {
    modelUsuarios.listarUsuarios((err, usuarios) => {
        if (err) {
            console.warn(err);
        } else {
            let etiquetas = [];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                modelEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if (err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if (i === array.length - 1) {
                            response.render("usuarios/usuarios", {
                                nombre: response.locals.nombre,
                                titulo: "Usuarios",
                                usuarios: usuarios,
                                etiquetas: etiquetas
                            });
                        }
                    }
                });
            });

            if (usuarios.length == 0) {
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "No hay usuarios",
                    usuarios: usuarios,
                    etiquetas: []
                });
            }
        }
    });
}

function imagenPerfil(request, response) {
    response.status(200);
    modelUsuarios.imagen(response.locals.userEmail, function (err, image) {
        if (err) {
            console.warn(err);
        } else {    //Siempre tiene imagen
            let ruta = path.join(__dirname, "../", image);
            response.sendFile(ruta);
        }
    })
}

function imagenPorId(request, response) {
    response.status(200);
    modelUsuarios.leerPorId(request.params.id, function(err, usuario) {
        if(err) {
            console.warn(err);
        } else {
            modelUsuarios.imagen(usuario[0].email, function (err, image) {
                if (err) {
                    console.warn(err);
                } else {    //Siempre tiene imagen
                    let ruta = path.join(__dirname, "../", image);
                    response.sendFile(ruta);
                }
            })
        }
    })
}

function buscar(request, response) {
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

function buscarPorNombre(request, response) {
    response.status(200);

    modelUsuarios.buscarUsuariosPorNombre(request.params.busqueda, (err, usuarios) => {
        if (err) {
            console.warn(err);
        } else {
            let etiquetas = [];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                modelEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if (err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if (i === array.length - 1) {
                            response.render("usuarios/usuarios", {
                                nombre: response.locals.nombre,
                                titulo: "Usuarios filtrados por ['" + request.params.busqueda + "']",
                                usuarios: usuarios,
                                etiquetas: etiquetas
                            });
                        }
                    }
                });
            });

            if (usuarios.length == 0) {
                response.render("usuarios/usuarios", {
                    nombre: response.locals.nombre,
                    titulo: "No hay usuarios",
                    usuarios: usuarios,
                    etiquetas: []
                });
            }
        }
    });
}

function mostrarPerfil(request, response) {
    response.status(200);

    modelUsuarios.leerPorEmail(response.locals.userEmail, (err, usuario) => {
        modelUsuarios.leerPorId(request.params.id, (err, perfil) => {
            if(err) {
                console.warn(err);
            } else {
                perfil[0].fecha_alta = perfil[0].fecha_alta.toLocaleDateString();

                modelPreguntas.contar(request.params.id, (err, preguntas) => {
                    if(err) {
                        console.warn(err);
                    } else {
                        
                        perfil[0].n_preguntas = preguntas[0].n_preguntas;

                        modelRespuestas.contar(request.params.id, (err, respuestas) => {
                            if(err) {
                                console.warn(err);
                            } else {
                                perfil[0].n_respuestas = respuestas[0].n_respuestas;

                                modelUsuarios.medallas(request.params.id, (err, medallas) => {
                                
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
}

module.exports = {
    listarUsuarios,
    imagenPerfil,
    imagenPorId,
    buscar,
    buscarPorNombre,
    mostrarPerfil
}