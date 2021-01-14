/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

const utils = require("../utils");
const pool = utils.pool;

const MODELPreguntas = require("../models/modelPreguntas");
const MODELRespuestas = require("../models/modelRespuestas");
const MODELEtiquetas = require("../models/modelEtiquetas");
const MODELVotos = require("../models/modelVotos");

const modelPreguntas = new MODELPreguntas(pool);
const modelRespuestas = new MODELRespuestas(pool);
const modelEtiquetas = new MODELEtiquetas(pool);
const modelVotos = new MODELVotos(pool);

function listarPreguntas(request, response, next) {
    modelPreguntas.listarPreguntas((err, preguntas) => {
        if (err) {
            response.status(500);
            next();
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            modelEtiquetas.listarEtiquetas((err, etiquetas) => {
                if (err) {
                    response.status(500);
                    next();
                } else {
                    response.render("preguntas/preguntas", {
                        preguntas: preguntas,
                        etiquetas: etiquetas,
                        titulo: "Todas las preguntas",
                        nombre: response.locals.nombre
                    });
                }
            });
        }
    });
}

function buscarPorTexto(request, response, next) {
    response.status(200);
    if (request.body.busqueda !== "") {
        let ruta = "/preguntas/buscar/" + request.body.busqueda;
        response.redirect(ruta);
    } else {
        renderizarPreguntas(response, [], [], "Ningun resultado", response.locals.nombre);
    }
}

function buscarPorID(request, response, next) {
    response.status(200);
    modelPreguntas.buscar(request.params.id, (err, preguntas) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (preguntas.length == 0) {
                renderizarPreguntas(response, [], [], "Ningun resultado", response.locals.nombre);
            } else {
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id + " ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma

                modelEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);
                        renderizarPreguntas(response, preguntas, etiquetas, "Resultado de las búsqueda '" + request.params.id + "'", response.locals.nombre);
                    }
                });
            }
        }
    });
}

function buscarPorEtiqueta(request, response, next) {
    modelPreguntas.leerPorEtiqueta(request.params.etiqueta, (err, preguntas) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (preguntas.length == 0) {
                renderizarPreguntas(response, [], [], "Ningun resultado", response.locals.nombre);

            } else {
                let etiquetasALeer = "";
                preguntas.forEach(pregunta => {
                    etiquetasALeer += pregunta.id + " ,";
                });
                etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma

                modelEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        preguntas = utils.reducirCuerpoA150(preguntas);
                        renderizarPreguntas(response, preguntas, etiquetas, "Preguntas con la etiqueta [" + request.params.etiqueta + "]", response.locals.nombre);
                    }
                });
            }
        }
    });
}

function formularPregunta(request, response, next) {
    response.render("preguntas/formular", {
        errorM: "nada",
        nombre: response.locals.nombre

    });
}

function mostrarSinResponder(request, response, next) {
    modelPreguntas.buscarSinRespuesta((err, preguntas) => {
        if (err) {
            response.status(500);
            next();
        } else {
            preguntas = utils.reducirCuerpoA150(preguntas);
            let etiquetasALeer = "";
            preguntas.forEach(pregunta => {
                etiquetasALeer += pregunta.id + " ,";
            });
            etiquetasALeer = etiquetasALeer.substring(0, etiquetasALeer.length - 1); //para quitar la ultima coma
            modelEtiquetas.leerPorIdEtiquetas(etiquetasALeer, (err, etiquetas) => {
                if (err) {
                    response.status(500);
                    next();
                } else {
                    preguntas = utils.reducirCuerpoA150(preguntas);
                    renderizarPreguntas(response, preguntas, etiquetas, "Preguntas sin responder", response.locals.nombre);
                }
            });
        }
    });
}

function procesarPregunta(request, response, next) {
    response.status(200);

    if (request.body.titulo.length > 4 && request.body.cuerpo.length > 8) {

        let etiquetas = utils.procesarEtiquetas(request.body.etiquetas);

        if (etiquetas.ok) {
            modelPreguntas.insertarPregunta(response.locals.id, request.body.titulo, request.body.cuerpo, (err, rows) => {
                if (err) {
                    response.status(500);
                    next();
                } else {
                    etiquetas.etiquetas.forEach(etiqueta => {
                        modelEtiquetas.insertarEtiqueta(rows.insertId, etiqueta, (err, ok) => {
                            if (err) {
                                response.status(500);
                                next();
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
                nombre: response.locals.nombre

            });
        }
    } else {
        response.render("preguntas/formular", {
            errorM: "titulo",
            errorMsg: "Error con el titulo o el cuerpo",
            nombre: response.locals.nombre
        });
    }
}

function renderizarPreguntas(r, p, e, t, n) {
    let usuario = {};
    r.render("preguntas/preguntas",  {
        preguntas: p,
        etiquetas: e,
        titulo: t,
        nombre: n
    });
}

function visitasPorId(request, response, next) {
    response.status(200);

    modelPreguntas.leerVisitas(request.params.id, (err, visitas) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (visitas[0] !== undefined) {
                let visit = visitas[0].visitas + 1;
                modelPreguntas.actualizarVisitas(request.params.id, visit, (err, rows) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.id);
                    }
                });
            }
        }
    });
}

function procesarRespuesta(request, response, next) {
    response.status(200);
    if (request.body.cuerpo !== "") {

        modelRespuestas.insertarRespuesta(request.body.id_preg, response.locals.id, request.body.cuerpo, (err, rows) => {
            if (err) {
                response.status(500);
                next();
            } else {
                response.redirect("/preguntas");
            }
        });

    } else {
        let ruta = "/preguntas/vista/" + request.body.id_preg;
        response.redirect(ruta);
    }
}

function preguntaDetalle(request, response, next) {
    response.status(200); 
    modelPreguntas.buscarPorId(request.params.id, (err, pregunta) => {
        if (err) {
            response.status(500);
            console.warn(err);
            next();
        } else {
            if (pregunta.length == 0) {
                response.render("preguntas/preguntas", {
                    preguntas: [],
                    etiquetas: [],
                    titulo: "Ningún resultado",
                    nombre: response.locals.nombre

                });
            } else {
                modelEtiquetas.leerPorIdEtiquetas(pregunta[0].id, (err, etiquetas) => {
                    if (err) {
                        response.status(500);
                        console.warn(err);
                        next();
                    } else { 
                        modelRespuestas.listarRespuestas(pregunta[0].id, (err, respuestas) => {
                            if (err) {
                                response.status(500);
                                console.warn(err);
                                next();
                            } else {
             
                            response.render("preguntas/mostrar", {
                                pregunta: pregunta[0],
                                n_votos_preg: pregunta[0].puntos,
                                etiquetas: etiquetas[pregunta[0].id],
                                respuestas: respuestas,
                                nombre: response.locals.nombre });


                            }
                        });
                    }
                });
            }
        }
    });
}

function votarPregunta(request, response, next) {
    modelVotos.existeVotoPregunta(request.params.idPregunta, response.locals.id, (err, voto) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (voto[0] === undefined) {
                modelVotos.insertarVotoPregunta(request.params.idPregunta, response.locals.id, request.params.voto, (err, voto) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            } else if (voto[0].voto == request.params.voto) {
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            } else {
                modelVotos.modificarVotoPregunta(request.params.idPregunta, response.locals.id, request.params.voto, (err, voto) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
}

function votarRespuesta(request, response, next) {
    modelVotos.existeVotoRespuesta(request.params.idRespuesta, response.locals.id, (err, voto) => {
        if (err) {
            response.status(500);
            next();
        } else {
            if (voto[0] === undefined) {
                modelVotos.insertarVotoRespuesta(request.params.idRespuesta, response.locals.id, request.params.voto, (err, voto) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            } else if (voto[0].voto == request.params.voto) {
                response.redirect("/preguntas/vista/" + request.params.idPregunta);
            } else {
                modelVotos.modificarVotoRespuesta(request.params.idRespuesta, response.locals.id, request.params.voto, (err, voto) => {
                    if (err) {
                        response.status(500);
                        next();
                    } else {
                        response.redirect("/preguntas/vista/" + request.params.idPregunta);
                    }
                });
            }
        }
    });
}

module.exports = {
    listarPreguntas,
    buscarPorTexto,
    buscarPorID,
    buscarPorEtiqueta,
    formularPregunta,
    mostrarSinResponder,
    procesarPregunta,
    visitasPorId,
    procesarRespuesta,
    preguntaDetalle,
    votarPregunta,
    votarRespuesta
}