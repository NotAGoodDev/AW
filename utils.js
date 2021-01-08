//Funciones LOGICAS

const { text } = require("body-parser");

function informar(texto){
    let guiones = "";

    for (let i = 0; i < texto.length + 4; i++) {
        guiones += "-";
    }

    console.log(guiones + "\n| " + texto + " |\n" + guiones);
}

function passCoincide(pwd1, pwd2) {
    if (pwd1 === pwd2) {
        return true;
    } else {
        informar("LAS CONTRASEÑAS NO COINCIDEN");
        return false;
    }
}

function passCorrecta(pwd) {
    if (pwd.length > 7) {
        return true;
    } else {
        informar("LA CONTRASEÑA NO CUMPLE LOS REQUISITOS");
        return false;
    }
}

function gestionarImagen(imagen, email) {
    if(!imagen) {
        return "/img/users/u"
            + Math.floor(Math.random() * 8 + 1) //Del 1 al 8
            + ".png";
    } else {
        return "/img/users/"
            + email.split('@')[0].toLowerCase()
            + ".png";
    }
}

function reducirCuerpoA150(array){

    if(array instanceof Array && array.length > 0) {
        array.forEach(pregunta => {
            if(pregunta.cuerpo.length > 150){
                pregunta.cuerpo = pregunta.cuerpo.slice(0, 150) + "...";
            }
        })
    } else {
        console.warn(informar("NO ESTÁS PASANDO UN ARRAY A reducirCuerpoA150"));
    }


    return array;
}

function procesarEtiquetas (texto){
    let etiquetasProcesadas= [];
    console.log(texto);
    if(texto.length > 0){
        texto.split("@").forEach( x => {                //Dividimos por espacios y recorremos
            etiquetasProcesadas.push(x.trim());
        })
        etiquetasProcesadas.shift();  //hay un valor basura al principio
    }

    return etiquetasProcesadas;
}

module.exports = {
    informar,
    passCoincide,
    passCorrecta,
    gestionarImagen,
    reducirCuerpoA150,
    procesarEtiquetas
}