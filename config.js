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
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usu INT NOT NULL,
    titulo VARCHAR(20) NOT NULL,
    cuerpo VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    visitas INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id)
   );

  CREATE TABLE respuestas (
    id INT PRIMARY KEY,
    id_preg INT NOT NULL,
    id_usu_resp INT NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id),
    FOREIGN KEY (id_usu_resp) REFERENCES usuarios(id)
   );



 CREATE TABLE medallas (
    id INT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    tipo ENUM('bronce', 'plata', 'oro')
   );

 CREATE TABLE usuario_medallas(
    id INT NOT NULL,
    id_usu INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id) REFERENCES medallas(id),
    FOREIGN KEY (id_usu) REFERENCES usuarios(id),
    PRIMARY KEY(id, id_usu, fecha)
    );


CREATE TABLE etiquetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_preg INT NOT NULL,
    etiqueta VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id)
);

CREATE TABLE voto_preg (
    id_usu INT NOT NULL,
    id_pregunta INT NOT NULL,
    voto BOOLEAN NOT NULL,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id),
    FOREIGN KEY (id_pregunta) REFERENCES preguntas(id),
    PRIMARY KEY(id_usu, id_pregunta) 
);

CREATE TABLE voto_resp (
    id_usu INT NOT NULL,
    id_respuesta INT NOT NULL,
    voto BOOLEAN NOT NULL,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id),
    FOREIGN KEY (id_respuesta) REFERENCES respuestas(id),
    PRIMARY KEY(id_usu, id_respuesta) 
);




INSERT INTO `usuarios` VALUES (0, 'alex@404.com', 30, 'AAAAAAAA', 'alex', '/img/users/U1.png', '2020/12/24');
INSERT INTO `usuarios` VALUES (1, 'alvaro03@404.com', -49, 'BBBBBBBB', 'alvaro', '/img/users/U2.png', '2010/10/13');
INSERT INTO `usuarios` VALUES (2, 'pedro404@404.com', 70, 'CCCCCCCC', 'pedro', '/img/users/U3.png', '2011/09/22');
INSERT INTO `usuarios` VALUES (3, 'anamaria@404.com', 300, 'DDDDDDDD', 'ana', '/img/users/ana.png', '1990/06/04');


INSERT INTO `preguntas` VALUES (0, 0, 'html y css cosas', 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2020/12/24', 0);
INSERT INTO `preguntas` VALUES (0, 1, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);
INSERT INTO `preguntas` VALUES (0, 3, 'javascript', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04', 0);
INSERT INTO `preguntas` VALUES (0, 1, 'jbxdfvius', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);
INSERT INTO `preguntas` VALUES (0, 2, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);

INSERT INTO `respuestas` VALUES (0, 1, 2, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE());
INSERT INTO `respuestas` VALUES (1, 1, 0, 'dfn bvzkxc zxfdhjxvgnbvbnnxcvm bkladjf nlkvnmldfzkxnzblknzxlck Lorem Ipsum ha sido el texto de relleno estándar de las industrifgjdfhmfghmfghmghjmfdgas desde el año 1500', '1990/06/04');
INSERT INTO `respuestas` VALUES (2, 3, 0, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04');
INSERT INTO `respuestas` VALUES (3, 3, 3, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE());

INSERT INTO `etiquetas` VALUES (0, 1, 'javascript');
INSERT INTO `etiquetas` VALUES (0, 1, 'html');
INSERT INTO `etiquetas` VALUES (0, 1, 'css');
INSERT INTO `etiquetas` VALUES (0, 2, 'javascript');
INSERT INTO `etiquetas` VALUES (0, 3, 'javascript');
INSERT INTO `etiquetas` VALUES (0, 3, 'node');
INSERT INTO `etiquetas` VALUES (0, 4, 'javascript');
INSERT INTO `etiquetas` VALUES (0, 4, 'css');
INSERT INTO `etiquetas` VALUES (0, 1, 'express');

INSERT INTO `medallas` VALUES (0, 'Estudiante', 'bronce');
INSERT INTO `medallas` VALUES (1, 'Pregunta interesante', 'bronce');
INSERT INTO `medallas` VALUES (2, 'Buena pregunta', 'plata');
INSERT INTO `medallas` VALUES (3, 'Excelente pregunta', 'oro');
INSERT INTO `medallas` VALUES (4, 'Pregunta popular', 'bronce');
INSERT INTO `medallas` VALUES (5, 'Pregunta destacada', 'plata');
INSERT INTO `medallas` VALUES (6, 'Pregunta famosa', 'oro');
INSERT INTO `medallas` VALUES (7, 'Respuesta interesante', 'bronce');
INSERT INTO `medallas` VALUES (8, 'Buena respuesta', 'plata');
INSERT INTO `medallas` VALUES (9, 'Respuesta famosa', 'oro');

INSERT INTO `usuario_medallas` VALUES (0, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 0, CURDATE() + 1);
INSERT INTO `usuario_medallas` VALUES (0, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 3, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (2, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (2, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (3, 0, CURDATE());

INSERT INTO `usuario_medallas` VALUES (4, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (4, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (4, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (5, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (5, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (6, 0, CURDATE());

INSERT INTO `usuario_medallas` VALUES (7, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (7, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (7, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (8, 0, CURDATE());
INSERT INTO `usuario_medallas` VALUES (8, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (9, 0, CURDATE());

INSERT INTO `voto_preg` VALUES (2, 1, 0);
INSERT INTO `voto_preg` VALUES (2, 2, 0);
INSERT INTO `voto_preg` VALUES (3, 3, 1);
INSERT INTO `voto_preg` VALUES (3, 2, 0);
INSERT INTO `voto_preg` VALUES (1, 1, 1);
INSERT INTO `voto_preg` VALUES (1, 2, 1);
INSERT INTO `voto_preg` VALUES (1, 3, 1);
INSERT INTO `voto_preg` VALUES (1, 4, 1);

INSERT INTO `voto_resp` VALUES (2, 1, 0);
INSERT INTO `voto_resp` VALUES (2, 2, 0);
INSERT INTO `voto_resp` VALUES (3, 3, 1);
INSERT INTO `voto_resp` VALUES (3, 2, 0);
INSERT INTO `voto_resp` VALUES (1, 1, 1);
INSERT INTO `voto_resp` VALUES (1, 2, 1);
INSERT INTO `voto_resp` VALUES (1, 3, 1);
INSERT INTO `voto_resp` VALUES (1, 4, 1);


*/