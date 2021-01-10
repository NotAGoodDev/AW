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



    etiquetaMasRepetida(id_usuario, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT etiquetas.etiqueta, COUNT(etiquetas.etiqueta) AS etiquetaMax FROM etiquetas JOIN preguntas on etiquetas.id_preg=preguntas.id WHERE preguntas.id_usu = ? group by etiquetas.etiqueta ORDER BY etiquetaMax DESC;";
                connection.query(
                    query,
                    [id_usuario],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            callback(null, rows[0]);
                        }
                    }
                )
            }
        })
    }

    listarEtiquetas(callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT id_preg, etiqueta FROM etiquetas ORDER BY id_preg ASC;";
                connection.query(
                    query,
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            let etiquetasParseadas = new Array();
                            let indice = -1;
                            rows.forEach(etiqueta => {
                                if(etiqueta.id_preg != indice){
                                    indice = etiqueta.id_preg;
                                    etiquetasParseadas[etiqueta.id_preg]=new Array();
                                }
                                etiquetasParseadas[etiqueta.id_preg].push(etiqueta.etiqueta);
                            });
                            callback(null, etiquetasParseadas);
                        }
                    }
                )
            }
        })
    }
    leerPorIdEtiquetas(idsEtiquetas, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "SELECT id_preg, etiqueta FROM etiquetas WHERE id_preg IN ( " + idsEtiquetas + ") ORDER BY id_preg ASC;";
                connection.query(
                    query,
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            let etiquetasParseadas = new Array();
                            let indice = -1;
                            rows.forEach(etiqueta => {
                                if(etiqueta.id_preg != indice){
                                    indice = etiqueta.id_preg;
                                    etiquetasParseadas[etiqueta.id_preg]=new Array();
                                }
                                etiquetasParseadas[etiqueta.id_preg].push(etiqueta.etiqueta);
                            });
                            callback(null, etiquetasParseadas);
                        }
                    }
                )
            }
        })
    }


    insertarEtiqueta(id_preg, etiqueta, callback) {
        this.pool.getConnection( function(err, connection) {
            if(err) {
                callback(new Error("Error de conexión a la base de datos"))
            } else {
                const query = "INSERT INTO `etiquetas` VALUES (0, ?, ?);";
                connection.query(
                    query,
                    [id_preg, etiqueta],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"))
                        } else {
                            callback(null, true);
                        }
                    }
                )
            }
        })
    }

}


module.exports = DAOEtiquetas;