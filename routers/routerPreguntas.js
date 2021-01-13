/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const middlewares = require("../middlewares");
const controllerPreguntas = require("../controllers/controllerPreguntas");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", middlewares.controlAcceso, controllerPreguntas.listarPreguntas);

router.post("/busqueda", middlewares.controlAcceso, controllerPreguntas.buscarPorTexto);

router.get("/buscar/:id", middlewares.controlAcceso, controllerPreguntas.buscarPorID);

router.get("/etiquetadas/:etiqueta", middlewares.controlAcceso, controllerPreguntas.buscarPorEtiqueta);

router.get("/formular", middlewares.controlAcceso, controllerPreguntas.formularPregunta);

router.get("/sinResponder", middlewares.controlAcceso, controllerPreguntas.mostrarSinResponder);

router.post("/formular/procesar", middlewares.controlAcceso, controllerPreguntas.procesarPregunta);

router.get("/visitas/:id", middlewares.controlAcceso, controllerPreguntas.visitasPorId);

router.post("/procesarRespuesta", middlewares.controlAcceso, controllerPreguntas.procesarRespuesta);

router.get("/vista/:id", middlewares.controlAcceso, controllerPreguntas.preguntaDetalle);

router.get("/votarPregunta/:idPregunta/:voto", middlewares.controlAcceso, controllerPreguntas.votarPregunta);

router.get("/votarRespuesta/:idRespuesta/:voto/:idPregunta", middlewares.controlAcceso, controllerPreguntas.votarRespuesta);

module.exports = router;