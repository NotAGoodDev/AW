"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const middlewares = require("../middlewares");
const controllerUsuarios = require("../controllers/controllerUsuarios");


router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", middlewares.controlAcceso, controllerUsuarios.listarUsuarios);

router.get("/imagenPerfil", middlewares.controlAcceso, controllerUsuarios.imagenPerfil);

router.get("/imagen/:id", middlewares.controlAcceso, controllerUsuarios.imagenPorId);

router.post("/busqueda", middlewares.controlAcceso, controllerUsuarios.buscar);

router.get("/buscar/:busqueda", middlewares.controlAcceso, controllerUsuarios.buscarPorNombre);

router.get("/perfil/:id", middlewares.controlAcceso, controllerUsuarios.mostrarPerfil);


module.exports = router;
