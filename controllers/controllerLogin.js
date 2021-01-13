/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

const utils = require("../utils");
const pool = utils.pool;

const MODELUsuarios = require("../models/modelUsuarios");
const modelUsuarios = new MODELUsuarios(pool);

function mostrarLogin(request, response, next) {
    response.status(200);
    response.render("loginout/login", { 
        error : null
     });
}

function accesoUsuario(request, response, next) {
    modelUsuarios.esCorrecto(request.body.email, request.body.pass, function (err, existe) {
        if (err) {
            response.status(500);
            next();
        } else if (!existe) {
            response.status(200);
            response.render("loginout/login", {
                error : "Direccion de correo y/o contraseña no válidos"
            })

        } else {
            response.status(302);

            modelUsuarios.leerPorEmail(request.body.email, function(err, usuario) {
                if(err) {
                    response.status(500);
                    next();
                } else {
                    request.session.currentUser = usuario[0].email;
                    request.session.nombre = usuario[0].nombre;
                    request.session.idUsuario = usuario[0].id;

                    response.redirect("/index");
                }
            })
        }
    })
}

function cerrarSesion(request, response, next) {  
    response.status(200);
    request.session.destroy();
    response.redirect("/loginout/login", {
        error: null
    })
}

function mostrarRegistro(request, response, next) {
    response.status(200);
    response.render("loginout/registro", {
        error: null
    });
}

function altaUsuario(request, response, next) {
    response.status(200);

    if (utils.passCoincide(request.body.pwd, request.body.pwd2)
    && utils.passCorrecta(request.body.pwd)) {

        modelUsuarios.existe(request.body.email, (err, existe) => {
            if(err) {
                response.status(500);
                next();
            } else if(!existe) {
                let img = "";

                if(request.file === undefined) {
                    img = "/u" + Math.floor(Math.random() * 8 + 1) + ".png";
                } else {
                    img = request.file.filename;
                }
                    

                modelUsuarios.insertar(request.body.email, request.body.pwd, request.body.name, img, (err, insertado) => {
                    if(err) {
                        response.status(500);
                        next();
                    } else if(insertado) {
                        response.render("loginout/login", {
                            error: null
                        });
                        
                    } else {
                        response.render("loginout/registro", {
                            error: "Prueba con otro usuario"
                        });
                    }
                })
            } else {
                response.render("loginout/login", {
                    error: "Usuario ya existe"
                });
            }
        })
    } else {
        response.render("loginout/registro", {
            error: "¿Contraseñas correctas?"
        });
    }
}

module.exports = {
    mostrarLogin,
    accesoUsuario,
    cerrarSesion,
    mostrarRegistro,
    altaUsuario
}