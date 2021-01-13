/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"
const express = require("express");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");

//SUBIR IMAGEN
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname, "../", "profile_imgs") });

const controllerLogin = require("../controllers/controllerLogin");
const middlewares = require("../middlewares");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login", controllerLogin.mostrarLogin);

router.post("/login", controllerLogin.accesoUsuario);

router.get("/logout", middlewares.controlAcceso, controllerLogin.cerrarSesion);

router.get("/registro", controllerLogin.mostrarRegistro);

router.post("/registro", multerFactory.single("photo"), controllerLogin.altaUsuario);

module.exports = router;