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
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
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
    id INT PRIMARY KEY AUTO_INCREMENT,
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




INSERT INTO `usuarios` VALUES (1, 'alex@404.com',0 , '12345678', 'alex', '/profile_imgs/U1.png', '2020/12/24');
INSERT INTO `usuarios` VALUES (2, 'alvaro@404.com',0 , '12345678', 'alvaro', '/profile_imgs/U2.png', '2010/10/13');
INSERT INTO `usuarios` VALUES (3, 'pedro@404.com', 0, '12345678', 'pedro', '/profile_imgs/u3.png', '2011/09/22');
INSERT INTO `usuarios` VALUES (4, 'ana@404.com', 0, '12345678', 'ana', '/profile_imgs/u4.png', '1990/06/04');


INSERT INTO `preguntas` VALUES (0, 1, 'html y css cosas', 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2020/12/24', 0);
INSERT INTO `preguntas` VALUES (0, 2, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);
INSERT INTO `preguntas` VALUES (0, 4, 'javascript', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04', 0);
INSERT INTO `preguntas` VALUES (0, 2, 'jbxdfvius', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);
INSERT INTO `preguntas` VALUES (0, 3, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0);

INSERT INTO `respuestas` VALUES (0, 1, 3, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE());
INSERT INTO `respuestas` VALUES (0, 1, 1, 'dfn bvzkxc zxfdhjxvgnbvbnnxcvm bkladjf nlkvnmldfzkxnzblknzxlck Lorem Ipsum ha sido el texto de relleno estándar de las industrifgjdfhmfghmfghmghjmfdgas desde el año 1500', '1990/06/04');
INSERT INTO `respuestas` VALUES (0, 3, 1, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04');
INSERT INTO `respuestas` VALUES (0, 3, 4, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE());

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

INSERT INTO `usuario_medallas` VALUES (0, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 1, CURDATE() + 1);
INSERT INTO `usuario_medallas` VALUES (0, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 3, CURDATE());
INSERT INTO `usuario_medallas` VALUES (0, 4, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (1, 3, CURDATE());
INSERT INTO `usuario_medallas` VALUES (2, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (2, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (3, 1, CURDATE());

INSERT INTO `usuario_medallas` VALUES (4, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (4, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (4, 3, CURDATE());
INSERT INTO `usuario_medallas` VALUES (5, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (5, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (6, 1, CURDATE());

INSERT INTO `usuario_medallas` VALUES (7, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (7, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (7, 3, CURDATE());
INSERT INTO `usuario_medallas` VALUES (8, 1, CURDATE());
INSERT INTO `usuario_medallas` VALUES (8, 2, CURDATE());
INSERT INTO `usuario_medallas` VALUES (9, 1, CURDATE());

INSERT INTO `voto_preg` VALUES (3, 1, 0);
INSERT INTO `voto_preg` VALUES (3, 2, 0);
INSERT INTO `voto_preg` VALUES (4, 3, 1);
INSERT INTO `voto_preg` VALUES (4, 2, 0);
INSERT INTO `voto_preg` VALUES (2, 1, 1);
INSERT INTO `voto_preg` VALUES (2, 2, 1);
INSERT INTO `voto_preg` VALUES (2, 3, 1);
INSERT INTO `voto_preg` VALUES (2, 4, 1);

INSERT INTO `voto_resp` VALUES (3, 1, 0);
INSERT INTO `voto_resp` VALUES (3, 2, 0);
INSERT INTO `voto_resp` VALUES (4, 3, 1);
INSERT INTO `voto_resp` VALUES (4, 2, 0);
INSERT INTO `voto_resp` VALUES (2, 1, 1);
INSERT INTO `voto_resp` VALUES (2, 2, 1);
INSERT INTO `voto_resp` VALUES (2, 3, 1);
INSERT INTO `voto_resp` VALUES (2, 4, 1);

DELIMITER $$
CREATE TRIGGER `Reputacion_Usuarios_AU` AFTER UPDATE ON `voto_preg`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1 && NEW.voto != OLD.voto
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion + 10
      WHERE usuarios.id= 
      (SELECT id_usu FROM preguntas WHERE id = NEW.id_pregunta);
   ELSEIF NEW.voto = 0 && NEW.voto != OLD.voto
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion - 2
      WHERE usuarios.id= 
      (SELECT id_usu FROM preguntas WHERE id = NEW.id_pregunta) && usuarios.reputacion > 0;
  END IF ;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `Reputacion_Usuarios_AI` AFTER INSERT ON `voto_preg`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion + 10
      WHERE usuarios.id= 
      (SELECT id_usu FROM preguntas WHERE id = NEW.id_pregunta);
   ELSEIF NEW.voto = 0
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion - 2
      WHERE usuarios.id= 
      (SELECT id_usu FROM preguntas WHERE id = NEW.id_pregunta) && usuarios.reputacion > 0;
  END IF ;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `Reputacion_Usuarios_Respuesta_AU` AFTER UPDATE ON `voto_resp`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1 && NEW.voto != OLD.voto
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion + 10
      WHERE usuarios.id= 
      (SELECT id_usu_resp FROM respuestas WHERE id = NEW.id_respuesta);
   ELSEIF NEW.voto = 0 && NEW.voto != OLD.voto
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion - 2
      WHERE usuarios.id= 
      (SELECT id_usu_resp FROM respuestas WHERE id = NEW.id_respuesta) && usuarios.reputacion > 0;
  END IF ;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `Reputacion_Usuarios_Respuesta_AI` AFTER INSERT ON `voto_resp`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion + 10
      WHERE usuarios.id= 
      (SELECT id_usu_resp FROM respuestas WHERE id = NEW.id_respuesta);
   ELSEIF NEW.voto = 0
    THEN
      UPDATE usuarios SET usuarios.reputacion = usuarios.reputacion - 2
      WHERE usuarios.id= 
      (SELECT id_usu_resp FROM respuestas WHERE id = NEW.id_respuesta) && usuarios.reputacion > 0;
  END IF ;
END$$
DELIMITER ;


*/