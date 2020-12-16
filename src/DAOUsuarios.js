"use strict"

class DAOUsuarios {

    constructor(pool) {
        this.pool = pool;
    }

    insertar(email, contrasena, nombre, imagen, callback) {
        this.pool.getConnection( function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                // daoUser.insertar("A@404.COM", 0, 0, "CONTRASEÑA", "NOMBRE", "IMAGEN", 01/01/1990, (err, result) => {

                const query = "INSERT INTO USUARIOS VALUES (?, 0, 0, ?, ?, ?, CURDATE())";

                connection.query(
                    query,
                    [email, contrasena, nombre, imagen],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            if(rows.length === 0) {
                                callback(null, false);
                            } else {
                                callback(null, true);
                            }
                        }
                    }
                )
            }
        })
    }
}

module.exports = DAOUsuarios;