
/* IMPORT SESIONES */
const config = require("./config")
const sess = require("express-session");
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



module.exports = {
    session,
    controlAcceso
}