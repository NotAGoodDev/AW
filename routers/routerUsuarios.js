"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const utils = require("../utils");
const pool = utils.pool;
const middlewares = require("../middlewares");

///////////////////////////
const DAOUsuarios = require("../DAOUsuarios");
const DAOPreguntas = require("../DAOPreguntas");
const DAORespuestas = require("../DAORespuestas");
const DAOEtiquetas = require("../DAOEtiquetas");

const daoUsuarios = new DAOUsuarios(pool);
const daoPreguntas = new DAOPreguntas(pool);
const daoRespuestas = new DAORespuestas(pool);
const daoEtiquetas = new DAOEtiquetas(pool);
//////////////////////////

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/imagenUsuario", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    daoUsuarios.imagen(response.locals.userEmail, function (err, image) {
        if (err) {
            console.warn(err);
        } else {    //Siempre tiene imagen
            let ruta = path.join(__dirname, image);
            console.log(ruta);
            response.sendFile(ruta);
        }
    })
})

router.get("/", middlewares.controlAcceso, function (request, response) {
    daoUsuarios.listarUsuarios((err, usuarios) => {
        if (err) {
            console.warn(err);
        } else {
            let etiquetas = [];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                daoEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if (err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if (i === array.length - 1) {
                            response.render("usuarios/usuarios", {
                                usuario: {
                                    imagen: "",
                                    nombre: ""
                                },
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
                    usuario: {
                        imagen: "",
                        nombre: ""
                    },
                    titulo: "No hay usuarios",
                    usuarios: usuarios,
                    etiquetas: []
                });
            }
        }
    });
});

router.post("/busqueda", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    if (request.body.busqueda !== "") {
        let ruta = "/usuarios/buscar/" + request.body.busqueda;
        response.redirect(ruta);
    } else {
        response.render("usuarios/usuarios", {
            usuario: {
                imagen: "",
                nombre: ""
            },
            titulo: "No hay usuarios",
            usuarios: [],
            etiquetas: []
        });
    }
});

router.get("/buscar/:busqueda", middlewares.controlAcceso, function (request, response) {
    response.status(200);

    daoUsuarios.buscarUsuariosPorNombre(request.params.busqueda, (err, usuarios) => {
        if (err) {
            console.warn(err);
        } else {
            let etiquetas = [];
            let i = -1;
            usuarios.forEach((usuario, indice, array) => {
                daoEtiquetas.etiquetaMasRepetida(usuario.id, (err, etiqueta) => {
                    i++;
                    if (err) {
                        console.warn(err);
                    } else {
                        etiquetas[usuario.id] = etiqueta;
                        if (i === array.length - 1) {
                            response.render("usuarios/usuarios", {
                                usuario: {
                                    imagen: "",
                                    nombre: ""
                                },
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
                    usuario: {
                        imagen: "",
                        nombre: ""
                    },
                    titulo: "No hay usuarios",
                    usuarios: usuarios,
                    etiquetas: []
                });
            }
        }
    });
});


router.get("/perfil/:id", middlewares.controlAcceso, function (request, response) {
    response.status(200);

    daoUsuarios.leerPorEmail(response.locals.userEmail, (err, usuario) => {
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


module.exports = router;
