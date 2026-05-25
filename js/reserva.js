if (!localStorage.getItem("congfigRest")) {
    let congfigRest = {
        diesTancat: [0],
        horaObertura: "10:00",
        horaTancament: "22:30",
        maxPersones: 12
    };

    localStorage.setItem("congfigRest", JSON.stringify(congfigRest));
}

let Rjson = JSON.parse(localStorage.getItem("congfigRest"));

let form = document.querySelector("form");
let nom = document.getElementById("nom");
let email = document.getElementById("email");
let dia = document.getElementById("dia");
let hora = document.getElementById("hora");
let nPersones = document.getElementById("nPersones");

nom.addEventListener("input", () => validarFormulari());
email.addEventListener("input", () => validarFormulari());
dia.addEventListener("change", () => validarFormulari());
hora.addEventListener("input", () => validarFormulari());
nPersones.addEventListener("input", () => validarFormulari());

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let be = validarFormulari(true);
    if (be) {
        processarReserva();
    }
});

function mostrarError(input, missatge) {
    let error = input.parentElement.querySelector(".error");
    if(error){
       error.remove(); 
    }
    
    
    if (missatge != "") {
        let p = document.createElement("p");
        p.className = "error";
        p.style.color = "red";
        p.style.fontSize = "14px";
        p.style.marginTop = "10px";
        p.innerText = missatge;
        input.parentElement.appendChild(p);
        input.style.borderColor = "red";
    } else {
        input.style.borderColor = "green";
    }
}

function validarFormulari(moureFocus = false) {
    let be = true;
    let primer = null;
    if (nom.value == "") {
        mostrarError(nom, "El nom es obligatori.");
        be = false;
        if (primer == null) {
            primer = nom;
        }
    } else {
        mostrarError(nom, "");
    }

    let Email = email.value;
    if (Email == "") {
        mostrarError(email, "L'email es obligatori.");
        be = false;

        if (primer == null) {
            primer = email;
        }
    } else if (!Email.includes("@")) {
        mostrarError(email, "Introdueix un email valid.");
        be = false;
        if (primer == null) {
            primer = email;
        }
    } else {
        mostrarError(email, "");
    }

    let diaValid = true;
    if (dia.value == "") {
        mostrarError(dia, "La data es obligatoria.");
        be = false;
        diaValid = false;
        if (primer == null) {
            primer = dia;
        }

    } else {
        let dataSeleccionada = new Date(dia.value);
        let avui = new Date();
        avui.setHours(0, 0, 0, 0);
        if (dataSeleccionada < avui) {
            mostrarError(dia, "La data no pot ser passada.");
            be = false;
            diaValid = false;
            if (primer == null) {
                primer = dia;
            }
        } else if (Rjson.diesTancat.includes(dataSeleccionada.getDay())) {
            mostrarError(dia, "El diumenge el restaurant esta tancat.");
            be = false;
            diaValid = false;
            if (primer == null) {
                primer = dia;
            }
        } else {
            mostrarError(dia, "");
        }
    }
    let horaValida = true;
    if (hora.value == "") {
        mostrarError(hora, "L'hora es obligatoria.");
        be = false;
        horaValida = false;

        if (primer == null) {
            primer = hora;
        }
    } else if (hora.value < Rjson.horaObertura || hora.value > Rjson.horaTancament) {
        mostrarError(hora, "L'hora ha d'estar entre les " + Rjson.horaObertura + " i les " + Rjson.horaTancament + ".");
        be = false;
        horaValida = false;

        if (primer == null) {
            primer = hora;
        }
    } else {
        mostrarError(hora, "");
    }
    if (diaValid && horaValida) {
        let reserves = JSON.parse(localStorage.getItem("reserves"));
        let existeix = false;

        for (let i = 0; i < reserves.length; i++) {
            if (reserves[i].dia === dia.value && reserves[i].hora === hora.value) {
                existeix = true;
                break;
            }
        }
        if (existeix) {
            mostrarError(dia, "Ja existeix una reserva amb aquesta data i hora.");
            mostrarError(hora, "Hora no disponible.");

            be = false;

            if (primer == null) {
                primer = dia;
            }
        }
    }
    let numPersones = parseInt(nPersones.value);
    if (nPersones.value == "") {
        mostrarError(nPersones, "El nombre de persones es obligatori.");
        be = false;

        if (primer == null) {
            primer = nPersones;
        }
    } else if (isNaN(numPersones) || numPersones <= 0) {
        mostrarError(nPersones, "Ha de ser un numero positiu.");
        be = false;
        if (primer == null) {
            primer = nPersones;
        }
    } else if (numPersones > Rjson.maxPersones) {
        mostrarError(nPersones, "El limit maxim es de " + Rjson.maxPersones + " persones.");
        be = false;

        if (primer == null) {
            primer = nPersones;
        }
    } else {
        mostrarError(nPersones, "");
    }
    if (moureFocus && primer) {
        primer.focus();
    }
    return be;
}

function processarReserva() {
    let reserva = {
        nom: nom.value,
        email: email.value,
        dia: dia.value,
        hora: hora.value,
        persones: nPersones.value
    };
    let llistaReserves = JSON.parse(localStorage.getItem("reserves"));
    llistaReserves.push(reserva);

    localStorage.setItem("reserves", JSON.stringify(llistaReserves));

    let resum = `Confirmacio de la reserva:
    Nom: ${reserva.nom}
    Email: ${reserva.email}
    Dia: ${reserva.dia}
    Hora: ${reserva.hora}
    Persones: ${reserva.persones}`;
    alert(resum);

    form.reset();

    nom.style.borderColor = "";
    email.style.borderColor = "";
    dia.style.borderColor = "";
    hora.style.borderColor = "";
    nPersones.style.borderColor = "";

    let errors = document.querySelectorAll(".error");
    for (let i = 0; i < errors.length; i++) {
        errors[i].remove();
    }
}