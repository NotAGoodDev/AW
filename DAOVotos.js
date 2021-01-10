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

    
    insertarVotoPregunta(id_pregunta, idUsuario, voto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "INSERT INTO `voto_preg` VALUES (?, ?, ?);";
                connection.query(
                    query,
                    [idUsuario, id_pregunta, voto],
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

    insertarVotoRespuesta(id_respuesta, idUsuario, voto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "INSERT INTO `voto_resp` VALUES (?, ?, ?);";
                connection.query(
                    query,
                    [idUsuario, id_respuesta, voto],
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

    

    modificarVotoPregunta(id_pregunta, idUsuario, voto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "UPDATE `voto_preg` SET `voto` = ? WHERE id_usu = ? AND id_pregunta = ?;";
                connection.query(
                    query,
                    [voto, idUsuario, id_pregunta],
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

    modificarVotoRespuesta(id_respuesta, idUsuario, voto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "UPDATE `voto_resp` SET `voto` = ? WHERE id_usu = ? AND id_respuesta = ?;";
                connection.query(
                    query,
                    [voto, idUsuario, id_respuesta],
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

    contarDePreguntas(id_pregunta,pos_neg, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
            const query = "SELECT COUNT(id_pregunta) AS n_votos FROM voto_preg WHERE id_pregunta = ? AND voto = ?;";
                connection.query(
                    query,
                    [id_pregunta, pos_neg],
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




    contarDeRespuestas(id_respuesta, pos_neg, callback) {
    this.pool.getConnection( function(err, connection) {
        if(err) {
            callback(new Error("Error de conexión a la base de datos"))
        } else {
        const query = "SELECT COUNT(id_respuesta) AS n_votos FROM voto_resp WHERE id_respuesta = ? AND voto = ?;";
            connection.query(
                query,
                [id_respuesta, pos_neg],
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

    existeVotoPregunta(id_pregunta,id_usuario, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
            const query = "SELECT voto FROM voto_preg WHERE id_pregunta = ? AND id_usu = ?;";
                connection.query(
                    query,
                    [id_pregunta, id_usuario],
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

    existeVotoRespuesta(id_respuesta,id_usuario, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
            const query = "SELECT voto FROM voto_resp WHERE id_respuesta = ? AND id_usu = ?;";
                connection.query(
                    query,
                    [id_respuesta, id_usuario],
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