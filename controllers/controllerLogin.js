/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

const utils = require("../utils");
const pool = utils.pool;

const MODELUsuarios = require("../models/modelUsuarios");
const modelUsuarios = new MODELUsuarios(pool);

function mostrarLogin(request, response) {
    response.status(200);
    response.render("loginout/login", { 
        errorMsg : null
     });
}

function accesoUsuario(request, response) {
    modelUsuarios.esCorrecto(request.body.email, request.body.pass, function (err, existe) {

        if (err || !existe) {
            response.status(200);
            response.render("loginout/login", {
                errorMsg : "Direccion de correo y/o contraseña no válidos"
            })

        } else {
            response.status(302);

            modelUsuarios.leerPorEmail(request.body.email, function(err, usuario) {
                if(err) {
                    console.warn(err);
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

function cerrarSesion(request, response) {  
    response.status(200);
    request.session.destroy();
    response.redirect("/loginout/login")
}

function mostrarRegistro(request, response) {
    response.status(200);
    response.render("loginout/registro");
}

function altaUsuario(request, response) {
    response.status(200);

    if (utils.passCoincide(request.body.pwd, request.body.pwd2)
    && utils.passCorrecta(request.body.pwd)) {

        modelUsuarios.existe(request.body.email, (err, existe) => {

            if(!existe) {
                let img = "";

                if(request.file === undefined) {
                    img = "/u" + Math.floor(Math.random() * 8 + 1) + ".png";
                } else {
                    img = request.file.filename;
                }
                    

                modelUsuarios.insertar(request.body.email, request.body.pwd, request.body.name, img, (err, insertado) => {
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
}

module.exports = {
    mostrarLogin,
    accesoUsuario,
    cerrarSesion,
    mostrarRegistro,
    altaUsuario
}