/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

class DAORespuestas {

    constructor(pool) {
        this.pool = pool;
    }

    contar(id_usu, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT COUNT(id) AS n_respuestas FROM RESPUESTAS WHERE id_usu_resp = ?";
                connection.query(
                    query,
                    [id_usu],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            callback(null, rows);
                        }
                    }
                )
            }
        })
    }
}

module.exports = DAORespuestas;