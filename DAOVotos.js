/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

class DAOVotos {

    constructor(pool) {
        this.pool = pool;
    }

    contarDePreguntas(id_pregunta, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT COUNT(id_pregunta) AS n_votos FROM voto_preg WHERE id_pregunta = ?";
                connection.query(
                    query,
                    [id_pregunta],
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


    contarDeRespuestas(id_respuesta, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT COUNT(id_respuesta) AS n_votos FROM voto_resp WHERE id_respuesta = ?";
                connection.query(
                    query,
                    [id_respuesta],
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

module.exports = DAOVotos;