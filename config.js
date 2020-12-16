"use strict";

module.exports = {
      host: "localhost",// Ordenador que ejecuta el SGBD
      user: "root",   // Usuario que accede a la BD
      password: "",  // Contraseña con la que se accede a la BD
      database: "P404"  // Nombre de la base de datos
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
   
 CREATE TABLE medallas (
    id INT PRIMARY KEY,
    email VARCHAR(20) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
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
   
CREATE TABLE votos (
	id INT PRIMARY KEY,
    email VARCHAR(20) NOT NULL,
    id_preg_resp INT NOT NULL,
    voto INT NOT NULL,
    FOREIGN KEY (email) REFERENCES usuarios(email),
    FOREIGN KEY (id_preg_resp) REFERENCES preguntas(id)
);

CREATE TABLE etiquetas (
    id INT PRIMARY KEY,
    id_preg INT NOT NULL,
    etiqueta VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id)
);

CREATE TABLE tipovotos (
    id INT PRIMARY KEY,
    id_pregunta INT NOT NULL,
    pregunta BOOLEAN NOT NULL,
    FOREIGN KEY (id_pregunta) REFERENCES preguntas(id)
);
*/