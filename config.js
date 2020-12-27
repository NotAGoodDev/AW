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

USE P404;

CREATE TABLE usuarios (
    id INT PRIMARY KEY NOT NULL,
    email VARCHAR(20) UNIQUE NOT NULL,
    reputacion INT NOT NULL,
    contrasena VARCHAR(20) NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    imagen VARCHAR(100) NOT NULL,
    fecha_alta DATE
   );

CREATE TABLE preguntas (
    id INT PRIMARY KEY,
    id_usu INT NOT NULL,
    titulo VARCHAR(20) NOT NULL,
    cuerpo VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id)
   );

  CREATE TABLE respuestas (
    id INT PRIMARY KEY,
    id_preg INT NOT NULL,
    id_usu_resp INT NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id),
    FOREIGN KEY (id_usu_resp) REFERENCES usuarios(id)
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




INSERT INTO `usuarios` VALUES (0, 'alex@404.com', 30, 'AAAAAAAA', 'alex', '/img/users/U1.png', '2020/12/24');
INSERT INTO `usuarios` VALUES (1, 'alvaro03@404.com', -49, 'BBBBBBBB', 'alvaro', '/img/users/U2.png', '2010/10/13');
INSERT INTO `usuarios` VALUES (2, 'pedro404@404.com', 70, 'CCCCCCCC', 'pedro', '/img/users/U3.png', '2011/09/22');
INSERT INTO `usuarios` VALUES (3, 'anamaria@404.com', 300, 'DDDDDDDD', 'ana', '/img/users/ana.png', '1990/06/04');


INSERT INTO `preguntas` VALUES (0, 0, 'html y css cosas', 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2020/12/24');
INSERT INTO `preguntas` VALUES (1, 1, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13');
INSERT INTO `preguntas` VALUES (2, 3, 'javascript', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04');
INSERT INTO `preguntas` VALUES (3, 1, 'jbxdfvius', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13');
INSERT INTO `preguntas` VALUES (4, 2, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13');


INSERT INTO `etiquetas` VALUES (0, 1, 'javascript');
*/