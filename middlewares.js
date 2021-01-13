
/* IMPORT SESIONES */
const config = require("./config")
const sess = require("express-session");
const fs = require("fs");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(sess);
const sessionStore = new MySQLStore(config.mysqlConfig);

//MIDDLEWARE
const session = sess({
    saveUninitialized: false,
    secret: "foo1234",
    resave: false,
    store: sessionStore
})

function controlAcceso (request, response, next) {
    if(request.session.currentUser === undefined) {
        response.redirect("/loginout/login");
    } else {
        response.locals.userEmail = request.session.currentUser;
        response.locals.id = request.session.idUsuario;
        response.locals.nombre = request.session.nombre;

        next();
    }
}

function error404(request, response, next) {
    console.log("404");
    next();
}

function error500(request, response, next) {
    console.log(request.err);
}

module.exports = {
    session,
    controlAcceso,
    error404,
    error500
}