"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const controllerUsuarios = require("../controllers/controllerUsuarios");


router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", controllerUsuarios.listarUsuarios);

router.get("/imagenPerfil", controllerUsuarios.imagenPerfil);

router.get("/imagen/:id", controllerUsuarios.imagenPorId);

router.post("/busqueda", controllerUsuarios.buscar);

router.get("/buscar/:busqueda", controllerUsuarios.buscarPorNombre);

router.get("/perfil/:id", controllerUsuarios.mostrarPerfil);


module.exports = router;
