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
                            
                            
                            console.log(rows);
                            console.log(etiquetasParseadas);
                            callback(null, etiquetasParseadas);
                        }
                    }
                )
            }
        })
    }
    leerPorIdEtiquetas(id, callback) {
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