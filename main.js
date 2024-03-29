let dict = [
  'gatos',
  'papas',
  'fuego',
  'huevo',
  'color',
  'casas',
  'arbol',
  'nueve',
  'zorro',
  'remar',
  'locro',
  'jamon',
  'feliz',
  'cinco',
  'tonto',
  'cuero',
  'volar',
  'vuelo',
  'avion',
  'genio',
  'pibes',
  'queso',
  'pesos',
  'barro',
  'tigre',
  'pasos',
  'autos',
  'silla',
  'mesas'
];

let hiddenWord = dict[Math.floor(Math.random()*dict.length)];

const wordFields = document.querySelectorAll("#word-table .row");
const inputs = document.querySelectorAll("#word-table .col");
const resultAlert = document.getElementById("result-alert");

function checkChar(char) {
  const res = [];
  for (let i=0; i<hiddenWord.length; i++) {
    if (char[i] === hiddenWord[i]) res.push(1);
    else if (hiddenWord.includes(char[i])) res.push(0);
    else res.push(-1);
  }
  return res;
}

function showClues(result, field) {
  const inputs = field.querySelectorAll(".col");

  inputs.forEach((input, index) => {
    input.style.color = "white";
    if (result[index] < 0) input.style.backgroundColor = "var(--clr-gray)";
    else if (result[index] > 0) input.style.backgroundColor = "var(--clr-green)";
    else input.style.backgroundColor = "var(--clr-yellow)";
  });
}

function toggleInputs(field) {
  field.querySelectorAll(".col")
    .forEach(inpEl => inpEl.disabled = field.currentAttempt ? false : true);
}

function checkResult(result) {
  if (result.every(ans => ans === 1)) return true;
  else return false;
}

// Muestra una alerta al finalizar el juego
// @param {Boolean} isCorrect Indica si el usuario adivino la palabra
// @param {String} message - Mensaje que acompaña la alerta

function showResultAlert(isCorrect = false, message = "Error") {
  resultAlert.textContent = message;
  if (isCorrect) {
    resultAlert.classList.add("correct");
  } else {
    resultAlert.classList.add("wrong");
  }
  resultAlert.classList.remove("hidden");
}

wordFields.forEach((field, index) => {
  // habilita solo primer fila
  field.currentAttempt = index == 0 ? true : false;
  toggleInputs(field);

  field.addEventListener("submit", ev => {
    ev.preventDefault();
    let word = "";

    field.querySelectorAll(".col").forEach(inpEl => word += inpEl.value);

    const result = checkChar(word);
    showClues(result, field);

    // deshabilita fila actual y habilita la siguiente
    field.currentAttempt = false;
    toggleInputs(field);

    if (checkResult(result)) {
      showResultAlert(true, "Ganaste!");
    } else {
      if (field.nextElementSibling != null) {
        field.nextElementSibling.firstElementChild.currentAttempt = true;
        toggleInputs(field.nextElementSibling.firstElementChild);
        field.nextElementSibling.firstElementChild.firstElementChild.focus();
      } else {
        showResultAlert(false, "Perdiste");
      }
    }
  });

  field.addEventListener("keydown", ev => {
    const keyCode = ev.keyCode || ev.charCode;
    const word = field.querySelector(".word-container");

    // hace un submit al presionar enter si la palabra esta completa
    if (keyCode === 13) {
      const submitBtn = field.querySelector("button[type='submit']");

      for (const inpEl of word.children) {
        if (inpEl.value === "") return;
      }

      submitBtn.click();
    }
  });
});

inputs.forEach(input => {
  input.maxLength = 1;

  input.addEventListener("keydown", ev => {
    const keyCode = ev.keyCode || ev.charCode;


// usa backspace para borar y se agrega restricciones de teclas
    if (keyCode === 8) {
      if (input.value.length !== input.maxLength && input.previousElementSibling != null) {
        input.previousElementSibling.focus();
      }
    } else if (keyCode < 65 || keyCode > 90) {
      ev.preventDefault();
    }
  });

  // cambia el focus del input al agregar una letra
  input.addEventListener("input", () => {
    if (input.value.length === input.maxLength && input.nextElementSibling != null) {
      input.nextElementSibling.focus();
    }
  });
});
