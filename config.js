"use strict";

module.exports = {
    mysqlConfig: {
        host: "localhost", // Ordenador que ejecuta el SGBD
        user: "root", // Usuario que accede a la BD
        password: "", // Contraseña con la que se accede a la BD
        database: "p404" // Nombre de la base de datos
    },
    port: 3000 // Puerto en el que escucha el servidor
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
    puntos INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id)
   );

  CREATE TABLE respuestas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_preg INT NOT NULL,
    id_usu_resp INT NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    puntos INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_preg) REFERENCES preguntas(id),
    FOREIGN KEY (id_usu_resp) REFERENCES usuarios(id)
   );



 CREATE TABLE medallas (
    id INT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    tipo ENUM('bronce', 'plata', 'oro')
   );

 

    CREATE TABLE preguntas_medallas(
    id INT NOT NULL,
    id_usu INT NOT NULL,
    id_preg INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id) REFERENCES medallas(id),
    FOREIGN KEY (id_usu) REFERENCES usuarios(id),
    FOREIGN KEY (id_preg) REFERENCES preguntas(id),
    PRIMARY KEY(id, id_usu, id_preg)
    );

    CREATE TABLE respuestas_medallas(
    id INT NOT NULL,
    id_usu INT NOT NULL,
    id_resp INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id) REFERENCES medallas(id),
    FOREIGN KEY (id_usu) REFERENCES usuarios(id),
    FOREIGN KEY (id_resp) REFERENCES respuestas(id),
    PRIMARY KEY(id, id_usu, id_resp)
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




INSERT INTO `usuarios` VALUES (1, 'alex@404.com',0 , '12345678', 'alex', 'U1.png', '2020/12/24');
INSERT INTO `usuarios` VALUES (2, 'alvaro@404.com',0 , '12345678', 'alvaro', 'U2.png', '2010/10/13');
INSERT INTO `usuarios` VALUES (3, 'pedro@404.com', 0, '12345678', 'pedro', 'u3.png', '2011/09/22');
INSERT INTO `usuarios` VALUES (4, 'ana@404.com', 0, '12345678', 'ana', 'u4.png', '1990/06/04');


INSERT INTO `preguntas` VALUES (0, 1, 'html y css cosas', 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2020/12/24', 0,0);
INSERT INTO `preguntas` VALUES (0, 2, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0,0);
INSERT INTO `preguntas` VALUES (0, 4, 'javascript', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04', 0,0);
INSERT INTO `preguntas` VALUES (0, 2, 'jbxdfvius', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0,0);
INSERT INTO `preguntas` VALUES (0, 3, 'html y css cosas', 'orem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '2050/10/13', 0,0);

INSERT INTO `respuestas` VALUES (0, 1, 3, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE(), 0);
INSERT INTO `respuestas` VALUES (0, 1, 1, 'dfn bvzkxc zxfdhjxvgnbvbnnxcvm bkladjf nlkvnmldfzkxnzblknzxlck Lorem Ipsum ha sido el texto de relleno estándar de las industrifgjdfhmfghmfghmghjmfdgas desde el año 1500', '1990/06/04', 0);
INSERT INTO `respuestas` VALUES (0, 3, 1, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', '1990/06/04', 0);
INSERT INTO `respuestas` VALUES (0, 3, 4, 'lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500', CURDATE(), 0);

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


DELIMITER $$
CREATE TRIGGER `Puntos_Preguntas_AU` AFTER UPDATE ON `voto_preg`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1 && NEW.voto != OLD.voto
    THEN
      UPDATE preguntas SET preguntas.puntos = preguntas.puntos + 1
      WHERE preguntas.id= NEW.id_pregunta;
   ELSEIF NEW.voto = 0 && NEW.voto != OLD.voto
    THEN
       UPDATE preguntas SET preguntas.puntos = preguntas.puntos - 1
      WHERE preguntas.id= NEW.id_pregunta;
  END IF ;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `Puntos_Preguntas_AI` AFTER INSERT ON `voto_preg`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1
    THEN
      UPDATE preguntas SET preguntas.puntos = preguntas.puntos + 1
      WHERE preguntas.id= NEW.id_pregunta;
   ELSEIF NEW.voto = 0
    THEN
      UPDATE preguntas SET preguntas.puntos = preguntas.puntos - 1
      WHERE preguntas.id= NEW.id_pregunta;
  END IF ;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `Puntos_Respuestas_AU` AFTER UPDATE ON `voto_resp`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1 && NEW.voto != OLD.voto
    THEN
      UPDATE respuestas SET respuestas.puntos = respuestas.puntos + 1
      WHERE respuestas.id= NEW.id_respuesta;
   ELSEIF NEW.voto = 0 && NEW.voto != OLD.voto
    THEN
     UPDATE respuestas SET respuestas.puntos = respuestas.puntos - 1
      WHERE respuestas.id= NEW.id_respuesta;
  END IF ;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `Puntos_Respuestas_AI` AFTER INSERT ON `voto_resp`
 FOR EACH ROW BEGIN
  IF NEW.voto = 1
    THEN
      UPDATE respuestas SET respuestas.puntos = respuestas.puntos + 1
      WHERE respuestas.id= NEW.id_respuesta;
   ELSEIF NEW.voto = 0
    THEN
     UPDATE respuestas SET respuestas.puntos = respuestas.puntos - 1
      WHERE respuestas.id= NEW.id_respuesta;
  END IF ;
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `Medallas_Preguntas_Votadas_AU` AFTER UPDATE ON `preguntas`
 FOR EACH ROW BEGIN
  IF NEW.puntos = 1 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 0)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (0, OLD.id_usu,OLD.id, CURDATE());
  ELSEIF NEW.puntos = 2 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 1)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (1, OLD.id_usu,OLD.id, CURDATE());
  ELSEIF NEW.puntos = 4 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 2)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (2, OLD.id_usu,OLD.id, CURDATE());
  ELSEIF NEW.puntos = 6 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 3)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (3, OLD.id_usu,OLD.id, CURDATE());
  END IF ;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER `Medallas_Respuestas_Votadas_AU` AFTER UPDATE ON `respuestas`
 FOR EACH ROW BEGIN
  IF NEW.puntos = 2 && (SELECT respuestas_medallas.id FROM respuestas_medallas WHERE respuestas_medallas.id_usu = OLD.id_usu_resp && respuestas_medallas.id_resp = OLD.id && respuestas_medallas.id = 7)IS NULL
    THEN
      INSERT INTO `respuestas_medallas` VALUES (7, OLD.id_usu_resp,OLD.id, CURDATE());
  ELSEIF NEW.puntos = 4 && (SELECT respuestas_medallas.id FROM respuestas_medallas WHERE respuestas_medallas.id_usu = OLD.id_usu_resp && respuestas_medallas.id_resp = OLD.id && respuestas_medallas.id = 8)IS NULL
    THEN
      INSERT INTO `respuestas_medallas` VALUES (8, OLD.id_usu_resp,OLD.id, CURDATE());
  ELSEIF NEW.puntos = 6 && (SELECT respuestas_medallas.id FROM respuestas_medallas WHERE respuestas_medallas.id_usu = OLD.id_usu_resp && respuestas_medallas.id_resp = OLD.id && respuestas_medallas.id = 9)IS NULL
    THEN
      INSERT INTO `respuestas_medallas` VALUES (9, OLD.id_usu_resp,OLD.id, CURDATE());
  END IF ;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `Medallas_Preguntas_Visitadas_AU` AFTER UPDATE ON `preguntas`
 FOR EACH ROW BEGIN
  IF NEW.visitas = 2 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 4)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (4, OLD.id_usu,OLD.id, CURDATE());
  ELSEIF NEW.visitas = 4 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 5)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (5, OLD.id_usu,OLD.id, CURDATE());
  ELSEIF NEW.visitas = 6 && (SELECT preguntas_medallas.id FROM preguntas_medallas WHERE preguntas_medallas.id_usu = OLD.id_usu && preguntas_medallas.id_preg = OLD.id && preguntas_medallas.id = 6)IS NULL
    THEN
      INSERT INTO `preguntas_medallas` VALUES (6, OLD.id_usu,OLD.id, CURDATE());
  END IF ;
END$$
DELIMITER ;


*/