
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


INSERT INTO `usuarios` VALUES (1, 'nico@404.es',0 , '12345678', 'Nico', 'Nico.png', '2020/12/24');
INSERT INTO `usuarios` VALUES (2, 'roberto@404.es',0 , '12345678', 'Roberto', 'Kuroko.png', '2010/10/13');
INSERT INTO `usuarios` VALUES (3, 'sfg@404.es', 0, '12345678', 'SFG', 'SFG.png', '2011/09/22');
INSERT INTO `usuarios` VALUES (4, 'marta@404.es', 0, '12345678', 'Marta', 'Marta.png', '1990/06/04');
INSERT INTO `usuarios` VALUES (5, 'lucas@404.es', 0, '12345678', 'Lucas', 'Lucas.png', '1990/06/04');
INSERT INTO `usuarios` VALUES (6, 'emy@404.es', 0, '12345678', 'Emy', 'Amy.png', '1990/06/04');


INSERT INTO `preguntas` VALUES (0, 1, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2020/12/24', 0,0);
INSERT INTO `preguntas` VALUES (0, 2, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2050/10/13', 0,0);
INSERT INTO `preguntas` VALUES (0, 3, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay: \n asignaciones = \n comparaciones == y === \n Creo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).', '2020/12/24', 0,0);
INSERT INTO `preguntas` VALUES (0, 4, 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', '2020/12/13', 0,0);
INSERT INTO `preguntas` VALUES (0, 5, '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL. \n Normalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.', '2050/10/13', 0,0);

INSERT INTO `respuestas` VALUES (0, 1, 5, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella. \n Los posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.', CURDATE(), 0);
INSERT INTO `respuestas` VALUES (0, 1, 6, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', '2021/06/04', 0);

INSERT INTO `etiquetas` VALUES (0, 1, 'css');
INSERT INTO `etiquetas` VALUES (0, 1, 'css3');
INSERT INTO `etiquetas` VALUES (0, 2, 'css');
INSERT INTO `etiquetas` VALUES (0, 2, 'html');
INSERT INTO `etiquetas` VALUES (0, 3, 'JavaScript');
INSERT INTO `etiquetas` VALUES (0, 4, 'nodejs');
INSERT INTO `etiquetas` VALUES (0, 5, 'mysql');
INSERT INTO `etiquetas` VALUES (0, 5, 'sql');

