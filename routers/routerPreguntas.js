/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const utils = require("../utils");
const pool = utils.pool;
const middlewares = require("../middlewares");

///////////////////////////
const DAOPreguntas = require("../DAOPreguntas");
const DAORespuestas = require("../DAORespuestas");
const DAOEtiquetas = require("../DAOEtiquetas");
const DAOVotos = require("../DAOVotos");


const daoPreguntas = new DAOPreguntas(pool);
const daoRespuestas = new DAORespuestas(pool);
const daoEtiquetas = new DAOEtiquetas(pool);
const daoVotos = new DAOVotos(pool);
//////////////////////////

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", middlewares.controlAcceso, function (request, response) {
    daoPreguntas.listarPreguntas((err, preguntas) => {
        if (err) {
            console.warn(err);
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            daoEtiquetas.listarEtiquetas((err, etiquetas) => {
                if (err) {
                    console.warn(err);
                } else {
                    response.render("preguntas/preguntas", {
                        preguntas: preguntas,
                        etiquetas: etiquetas,
                        titulo: "Todas las preguntas",
                        usuario: {
                            imagen: "",
                            nombre: ""
                        }
                    });
                }
            });
        }
    });
});

router.post("/busqueda", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    if (request.body.busqueda !== "") {
        let ruta = "/preguntas/buscar/" + request.body.busqueda;
        response.redirect(ruta);
    } else {
        response.render("preguntas/preguntas", {
            preguntas: [],
            etiquetas: [],
            titulo: "Ningún resultado",
            usuario: {
                imagen: "",
                nombre: ""
            }
        });
    }
});

router.get("/buscar/:id", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    daoPreguntas.buscar(request.params.id, (err, preguntas) => {
        if (err) {
            console.warn(err);
        } else {
            if (preguntas.length == 0) {
                response.render("preguntas/preguntas", {
                    preguntas: [],
                    etiquetas: [],
                    titulo: "Ningún resultado",
                    usuario: {
                        imagen: "",
                        nombre: ""
                    }
                });
            } else {
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id + " ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma

                daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);
                        response.render("preguntas/preguntas", {
                            preguntas: preguntas,
                            etiquetas: etiquetas,
                            titulo: "Resultado de las búsqueda '" + request.params.id + "'",
                            usuario: {
                                imagen: "",
                                nombre: ""
                            }
                        });
                    }
                });
            }
        }
    });
});

router.get("/etiquetadas/:etiqueta", middlewares.controlAcceso, function (request, response) {
    daoPreguntas.leerPorEtiqueta(request.params.etiqueta, (err, preguntas) => {
        if (err) {
            console.warn(err);
        } else {
            if (preguntas.length == 0) {
                response.render("preguntas/preguntas", {
                    preguntas: [],
                    etiquetas: [],
                    titulo: "Ningún resultado",
                    usuario: {
                        imagen: "",
                        nombre: ""
                    }
                });

            } else {
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id + " ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma

                daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);
                        response.render("preguntas/preguntas", {
                            preguntas: preguntas,
                            etiquetas: etiquetas,
                            titulo: "Preguntas con la etiqueta [" + request.params.etiqueta + "]",
                            usuario: {
                                imagen: "",
                                nombre: ""
                            }
                        });
                    }
                });
            }
        }
    });
});


router.get("/formular", middlewares.controlAcceso, function (request, response) {
    response.render("preguntas/formular", {
        errorM: "nada",
        usuario: {
            imagen: "",
            nombre: ""
        }
    });
});

router.get("/sinResponder", middlewares.controlAcceso, function (request, response) {
    daoPreguntas.buscarSinRespuesta((err, preguntas) => {
        if (err) {
            console.warn(err);
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            let etiquetasALeer = "";
            preguntas.forEach(pregunta => {
                etiquetasALeer += pregunta.id + " ,";
            });
            etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma
            daoEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                if (err) {
                    console.warn(err);
                } else {
                    preguntas = utils.reducirCuerpoA150(preguntas);
                    response.render("preguntas/preguntas", { preguntas: preguntas, etiquetas: etiquetas, titulo: "Preguntas sin responder", usuario: { imagen: "/img/users/U1.png", nombre: "Alex" } });
                }
            });
        }
    });
});

router.post("/formular/procesar", middlewares.controlAcceso, function (request, response) {
    response.status(200);

    if (request.body.titulo.length > 4 && request.body.cuerpo.length > 8) {

        let etiquetas = utils.procesarEtiquetas(request.body.etiquetas);

        if (etiquetas.ok) {
            daoPreguntas.insertarPregunta(id_usuario, request.body.titulo, request.body.cuerpo, (err, rows) => {
                if (err) {
                    console.warn(err);
                } else {
                    etiquetas.etiquetas.forEach(etiqueta => {
                        daoEtiquetas.insertarEtiqueta(rows.insertId, etiqueta, (err, ok) => {
                            if (err) {
                                console.warn(err);
                            }
                        });
                    });
                }
            });
            response.redirect("/preguntas");

        } else {
            response.render("preguntas/formular", {
                errorM: "etiquetas",
                errorMsg: etiquetas.errorMsg,
                usuario: {
                    imagen: "",
                    nombre: ""
                }
            });
        }
    } else {
        response.render("preguntas/formular", {
            errorM: "titulo",
            errorMsg: "Error con el titulo o el cuerpo",
            usuario: {
                imagen: "",
                nombre: ""
            }
        }); //hacemos algo más?
    }
});

router.get("/visitas/:id", middlewares.controlAcceso, function (request, response) {
    response.status(200);

    daoPreguntas.leerVisitas(request.params.id, (err, visitas) => {
        if (err) {
            console.warn(err);
        } else {
            if (visitas[0] !== undefined) {
                let visit = visitas[0].visitas + 1;
                daoPreguntas.actualizarVisitas(request.params.id, visit, (err, rows) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.id);
                    }
                });
            }
        }
    });
});

router.post("/procesarRespuesta", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    if (request.body.cuerpo !== "") {

        daoRespuestas.insertarRespuesta(request.body.id_preg, id_usuario, request.body.cuerpo, (err, rows) => {
            if (err) {
                console.warn(err);
            } else {
                response.redirect("/preguntas");
            }
        });


    } else {
        let ruta = "/preguntas/vista/" + request.body.id_preg;
        response.redirect(ruta); //hacemos algo más?
    }
});


router.get("/vista/:id", middlewares.controlAcceso, function (request, response) {
    response.status(200);
    daoPreguntas.buscarPorId(request.params.id, (err, pregunta) => {
        if (err) {
            console.warn(err);
        } else {
            if (pregunta.length == 0) {
                response.render("preguntas/preguntas", {
                    preguntas: [],
                    etiquetas: [],
                    titulo: "Ningún resultado",
                    usuario: {
                        imagen: "",
                        nombre: "Alex"
                    }
                });
            } else {
                daoEtiquetas.leerPorIdEtiquetas(pregunta[0].id, (err, etiquetas) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        daoVotos.contarDePreguntas(pregunta[0].id, 1, (err, n_votos_pos) => {
                            if (err) {
                                console.warn(err);
                            } else {
                                daoVotos.contarDePreguntas(pregunta[0].id, 0, (err, n_votos_neg) => {
                                    if (err) {
                                        console.warn(err);
                                    } else {
                                        daoRespuestas.listarRespuestas(pregunta[0].id, (err, respuestas) => {
                                            if (err) {
                                                console.warn(err);
                                            } else {
                                                let entra = false;
                                                let n_votos_resp_negativos = [];
                                                let n_votos_resp_positivos = [];
                                                respuestas.forEach((respuesta, indice, array) => {
                                                    daoVotos.contarDeRespuestas(respuesta.id, 1, (err, votos) => {
                                                        if (err) {
                                                            console.warn(err);
                                                        } else {
                                                            n_votos_resp_positivos.push(votos[0].n_votos);
                                                            if (indice == array.length - 1) {
                                                                respuestas.forEach((respuesta2, indice2, array2) => {
                                                                    daoVotos.contarDeRespuestas(respuesta2.id, 0, (err2, votos2) => {
                                                                        if (err2) {
                                                                            console.warn(err2);
                                                                        } else {
                                                                            n_votos_resp_negativos.push(votos2[0].n_votos);
                                                                            if (indice2 == array2.length - 1) {
                                                                                entra = true;
                                                                                response.render("preguntas/mostrar", {
                                                                                    pregunta: pregunta[0],
                                                                                    n_votos_preg: (n_votos_pos[0].n_votos - n_votos_neg[0].n_votos),
                                                                                    etiquetas: etiquetas[pregunta[0].id],
                                                                                    respuestas: respuestas,
                                                                                    n_votos_resp_positivos: n_votos_resp_positivos,
                                                                                    n_votos_resp_negativos: n_votos_resp_negativos,
                                                                                    usuario: {
                                                                                        imagen: "",
                                                                                        nombre: ""
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                })
                                                            }
                                                        }
                                                    });
                                                })

                                                setTimeout(() => {
                                                    if (!entra) {
                                                        response.render("preguntas/mostrar", {
                                                            pregunta: pregunta[0],
                                                            n_votos_preg: (n_votos_pos[0].n_votos - n_votos_neg[0].n_votos),
                                                            etiquetas: etiquetas[pregunta[0].id],
                                                            respuestas: respuestas,
                                                            n_votos_resp_positivos: n_votos_resp_positivos,
                                                            n_votos_resp_negativos: n_votos_resp_negativos,
                                                            usuario: {
                                                                imagen: "",
                                                                nombre: ""
                                                            }
                                                        });
                                                    }
                                                }, 3000);
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


router.get("/votarPregunta/:idPregunta/:voto", middlewares.controlAcceso, function (request, response) {
    daoVotos.existeVotoPregunta(request.params.idPregunta, id_usuario, (err, voto) => {
        if (err) {
            console.warn(err);
        } else {
            if (voto[0] === undefined) {
                daoVotos.insertarVotoPregunta(request.params.idPregunta, id_usuario, request.params.voto, (err, voto) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            } else if (voto[0].voto == request.params.voto) {
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            } else {
                daoVotos.modificarVotoPregunta(request.params.idPregunta, id_usuario, request.params.voto, (err, voto) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
});


router.get("/votarRespuesta/:idRespuesta/:voto/:idPregunta", middlewares.controlAcceso, function (request, response) {
    daoVotos.existeVotoRespuesta(request.params.idRespuesta, id_usuario, (err, voto) => {
        if (err) {
            console.warn(err);
        } else {
            if (voto[0] === undefined) {
                daoVotos.insertarVotoRespuesta(request.params.idRespuesta, id_usuario, request.params.voto, (err, voto) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            } else if (voto[0].voto == request.params.voto) {
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            } else {
                daoVotos.modificarVotoRespuesta(request.params.idRespuesta, id_usuario, request.params.voto, (err, voto) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
});


module.exports = router;