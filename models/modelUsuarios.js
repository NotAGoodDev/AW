/*  
    G-26
    Alejandro Bazaco Pérez
    Álvaro David Ortiz Marchut
*/

"use strict"

class DAOUsuarios {

    constructor(pool) {
        this.pool = pool;
    }

    funcion(parametros, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "";
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

    buscarUsuariosPorNombre(texto, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT id, imagen, nombre, reputacion FROM `usuarios` WHERE nombre LIKE ? ORDER BY id ASC;";
                connection.query(
                    query,
                    ['%' + texto + '%'],
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


    listarUsuarios(callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT id, imagen, nombre, reputacion FROM `usuarios` ORDER BY id ASC;";
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

    existe(email, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT * FROM USUARIOS WHERE EMAIL = ?";
                connection.query(
                    query,
                    [email],
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            if(rows.length == 0) {
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


    insertar(email, contrasena, nombre, imagen, callback) {
        this.pool.getConnection( function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "INSERT INTO USUARIOS VALUES (0, ?, 0, ?, ?, ?, CURDATE())";

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

    esCorrecto(email, pass, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT EMAIL FROM USUARIOS"
                + " WHERE EMAIL = ?"
                + " AND CONTRASENA = ?";

                connection.query(
                    query,
                    [email, pass],
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


    leerPorEmail(email, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT * FROM USUARIOS WHERE EMAIL = ?";
                connection.query(
                    query,
                    [email],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            if(rows.length === 0) {
                                callback(new Error("No existe un usuario con el email " + email))
                            } else {
                                callback(null, rows);
                            }
                        }
                    }
                )
            }
        })
    }

    leerPorId(id, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT * FROM USUARIOS WHERE ID = ?";
                connection.query(
                    query,
                    [id],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            if(rows.length === 0) {
                                callback(new Error("No existe un usuario con el id " + id))
                            } else {
                                callback(null, rows);
                            }
                        }
                    }
                )
            }
        })
    }

    medallas(id, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query =
                "SELECT U.ID, M.DESCRIPCION, M.TIPO, U.N"
                + " FROM MEDALLAS AS M,"
                + " ("
                    + " ( SELECT ID, COUNT(ID) AS N FROM preguntas_medallas"
                        + " WHERE id_usu = ?"
                        + " GROUP BY ID"
                    + " ) UNION ( SELECT ID, COUNT(ID) AS N FROM respuestas_medallas"
                        + " WHERE id_usu = ?"
                        + " GROUP BY ID"
                    + " )"
                + " ) AS U"
                + " WHERE U.ID = M.ID";

                connection.query(
                    query,
                    [id, id],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            let medallas = [];
                            medallas["bronce"] = [];
                            medallas["plata"] = [];
                            medallas["oro"] = [];
                            
                            rows.map((medalla, i) => {
                                medallas[ medalla.TIPO ].push(medalla);
                            })
                            
                            callback(null, medallas);
                        }
                    }
                )
            }
        })
    }

    imagen(email, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT imagen FROM USUARIOS"
                + " WHERE EMAIL = ?";
                connection.query(
                    query,
                    [email],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            if(rows[0].imagen == "") {
                                callback(null, null);
                            } else {
                                callback(null, rows[0].imagen);
                            }
                        }
                    }
                )
            }
        })
    }

}



module.exports = DAOUsuarios;