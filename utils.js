//Funciones LOGICAS

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

module.exports = {
    informar,
    passCoincide,
    passCorrecta,
    gestionarImagen
}