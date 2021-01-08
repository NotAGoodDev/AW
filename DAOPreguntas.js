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
                const query = "SELECT usuarios.nombre, usuarios.imagen, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha FROM usuarios JOIN preguntas on preguntas.id_usu = usuarios.id ORDER BY preguntas.fecha DESC;";
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

    buscar(texto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT usuarios.nombre, usuarios.imagen, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha FROM usuarios JOIN preguntas on preguntas.id_usu = usuarios.id WHERE titulo LIKE ? OR CUERPO LIKE ? ORDER BY usuarios.nombre ASC ";
                connection.query(
                    query,
                    ['%' + texto + '%', '%' + texto + '%'],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error(err));
                        } else {
                            callback(null, rows);
                        }
                    }
                )
            }
        })
    }


    buscarPorId(id, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT preguntas.visitas, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha, usuarios.nombre, usuarios.imagen FROM usuarios JOIN preguntas on preguntas.id_usu = usuarios.id WHERE preguntas.id=?; ";
                connection.query(
                    query,
                    [id],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error(err));
                        } else {
                            callback(null, rows);
                        }
                    }
                )
            }
        })
    }

    



    buscarSinRespuesta(callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT usuarios.nombre, usuarios.imagen, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha FROM preguntas LEFT JOIN respuestas on preguntas.id = respuestas.id_preg JOIN usuarios on preguntas.id_usu = usuarios.id WHERE respuestas.id_preg IS NULL ";
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

    leerPorEtiqueta(etiqueta, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT usuarios.nombre, usuarios.imagen, preguntas.id, preguntas.titulo, preguntas.cuerpo, preguntas.fecha FROM preguntas JOIN etiquetas on preguntas.id = etiquetas.id_preg JOIN usuarios on preguntas.id_usu = usuarios.id WHERE etiquetas.etiqueta = ?;";
                connection.query(
                    query,
                    [etiqueta],
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


    insertarPregunta(id_usu, titulo, cuerpo, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "INSERT INTO `preguntas` VALUES (0, ?, ?, ?, CURDATE(), 0);";
                connection.query(
                    query,
                    [id_usu, titulo, cuerpo],
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