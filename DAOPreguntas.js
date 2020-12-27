/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

class DAOPreguntas {

    constructor(pool) {
        this.pool = pool;
    }

    listarPreguntas(callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT usuarios.nombre, usuarios.imagen, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha FROM usuarios JOIN preguntas on preguntas.email = usuarios.email;";
                connection.query(
                    query,
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

    contar(id_usu, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT COUNT(id) AS n_preguntas FROM PREGUNTAS WHERE id_usu = ?";
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

module.exports = DAOPreguntas;