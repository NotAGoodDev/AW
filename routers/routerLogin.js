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
const DAOUsuarios = require("../DAOUsuarios");
const daoUsuarios = new DAOUsuarios(pool);
//////////////////////////

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login", function (request, response) {
    response.status(200);
    response.render("loginout/login", { 
        errorMsg : null
     });
});


router.post("/login", function (request, response) {
    daoUsuarios.esCorrecto(request.body.email, request.body.pass, function (err, existe) {

        if (err || !existe) {
            response.status(200);
            response.render("loginout/login", {
                errorMsg : "Direccion de correo y/o contraseña no válidos"
            })

        } else {
            response.status(302);
            request.session.currentUser = request.body.email;
            response.redirect("/index");
        }
    })
});

router.get("/logout", middlewares.controlAcceso, function (request, response) {  
    response.status(200);
    request.session.destroy();
    response.redirect("/loginout/login")
})

router.get("/registro", function (request, response) {
    response.status(200);
    response.render("loginout/registro");
});

router.post("/registro", function (request, response) {
    response.status(200);

    if (utils.passCoincide(request.body.pwd, request.body.pwd2)
    && utils.passCorrecta(request.body.pwd)) {

        daoUsuarios.existe(request.body.email, (err, existe) => {

            if(!existe) {    
                let img = utils.gestionarImagen(request.body.photo, request.body.email);

                daoUsuarios.insertar(request.body.email, request.body.pwd, request.body.name, img, (err, insertado) => {
                    if(insertado) {
                        utils.informar("EL USUARIO SE HA DADO DE ALTA CON EXITO")
                        response.render("loginout/login");
                        
                    } else {
                        utils.informar("EL USUARIO NO SE HA DADO DE ALTA")
                        response.render("loginout/registro");
                    }
                })
            } else {
                utils.informar("EL USUARIO YA ESTA DADO DE ALTA");
                response.render("loginout/login");
            }
        })
    } else {
        response.render("loginout/registro");
    }
});

module.exports = router;