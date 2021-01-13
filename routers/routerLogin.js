/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const controllerLogin = require("../controllers/controllerLogin");
const middlewares = require("../middlewares");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login", controllerLogin.mostrarLogin);

router.post("/login", controllerLogin.accesoUsuario);

router.get("/logout", middlewares.controlAcceso, controllerLogin.cerrarSesion);

router.get("/registro", controllerLogin.mostrarRegistro);

router.post("/registro", controllerLogin.altaUsuario);

module.exports = router;