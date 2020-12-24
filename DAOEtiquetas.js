/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

class DAOEtiquetas {

    constructor(pool) {
        this.pool = pool;
    }


    leerPorIdEtiquetas(parametros, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT FROM etiquet";
                connection.query(
                    query,
                    [values],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            /* CODIGO */
                        }
                    }
                )
            }
        })
    }
}


module.exports = DAOEtiquetas;