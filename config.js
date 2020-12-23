"use strict";

module.exports = {
    mysqlConfig: {
            host: "localhost",     // Ordenador que ejecuta el SGBD
            user: "root",          // Usuario que accede a la BD
            password: "",          // Contraseña con la que se accede a la BD
            database: "p404"     // Nombre de la base de datos
    },
      port: 3000                   // Puerto en el que escucha el servidor
 }
 

/*

DROP DATABASE IF EXISTS P404;
CREATE DATABASE P404;

CREATE TABLE usuarios (
    email VARCHAR(20) PRIMARY KEY,
    n_preguntas INT NOT NULL,
    reputacion INT NOT NULL,
    contrasena VARCHAR(20) NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    imagen VARCHAR(100) NOT NULL,
    fecha_alta DATE
   );

CREATE TABLE preguntas (
    id INT PRIMARY KEY,
    email VARCHAR(20) NOT NULL,
    titulo VARCHAR(20) NOT NULL,
    cuerpo VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (email) REFERENCES usuarios(email)
   );

  CREATE TABLE respuestas (
    id INT PRIMARY KEY,
    id_preg INT NOT NULL,
    email_resp VARCHAR(20) NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id),
    FOREIGN KEY (email_resp) REFERENCES usuarios(email)
   );

 CREATE TABLE medallas (
    id INT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
   );

 CREATE TABLE usuario_medallas(
     id INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (email) REFERENCES usuarios(email),
    FOREIGN KEY (id) REFERENCES medallas(id),
    PRIMARY KEY(id, email)
    );


CREATE TABLE etiquetas (
    id INT PRIMARY KEY,
    id_preg INT NOT NULL,
    etiqueta VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id)
);

CREATE TABLE voto_preg (
    email_usuario VARCHAR(20) NOT NULL,
    id_pregunta INT NOT NULL,
    voto BOOLEAN NOT NULL,
    FOREIGN KEY (email_usuario) REFERENCES usuarios(email),
    FOREIGN KEY (id_pregunta) REFERENCES preguntas(id),
    PRIMARY KEY(email_usuario, id_pregunta) 
);

CREATE TABLE voto_resp (
    email_usuario VARCHAR(20) NOT NULL,
    id_respuesta INT NOT NULL,
    voto BOOLEAN NOT NULL,
    FOREIGN KEY (email_usuario) REFERENCES usuarios(email),
    FOREIGN KEY (id_respuesta) REFERENCES respuestas(id),
    PRIMARY KEY(email_usuario, id_respuesta) 
);

*/