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

router.get("/", controllerPreguntas.listarPreguntas);

router.post("/busqueda", controllerPreguntas.buscarPorTexto);

router.get("/buscar/:id", controllerPreguntas.buscarPorID);

router.get("/etiquetadas/:etiqueta", controllerPreguntas.buscarPorEtiqueta);

router.get("/formular", controllerPreguntas.formularPregunta);

router.get("/sinResponder", controllerPreguntas.mostrarSinResponder);

router.post("/formular/procesar", controllerPreguntas.procesarPregunta);

router.get("/visitas/:id", controllerPreguntas.visitasPorId);

router.post("/procesarRespuesta", controllerPreguntas.procesarRespuesta);

router.get("/vista/:id", controllerPreguntas.preguntaDetalle);

router.get("/votarPregunta/:idPregunta/:voto", controllerPreguntas.votarPregunta);

router.get("/votarRespuesta/:idRespuesta/:voto/:idPregunta", controllerPreguntas.votarRespuesta);

module.exports = router;