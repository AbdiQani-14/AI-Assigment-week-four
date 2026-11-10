
const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldReset = false;

// Update calculator display
function updateDisplay() {
    currentDisplay.textContent = currentInput;
}

// Add numbers
function appendNumber(number) {
    if (currentInput === "Error" || shouldReset) {
        currentInput = number;
        shouldReset = false;
    } else {
        if (currentInput === "0") {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }

    updateDisplay();
}

// Add decimal point
function appendDecimal() {
    if (currentInput === "Error" || shouldReset) {
        currentInput = "0.";
        shouldReset = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Select operator
function chooseOperator(selectedOperator) {
    if (currentInput === "Error") return;

    if (operator !== null && !shouldReset) {
        calculate();
        if (currentInput === "Error") return;
    }

    previousInput = currentInput;
    operator = selectedOperator;
    shouldReset = true;

    previousDisplay.textContent =
        `${previousInput} ${operator}`;
}

// Calculate result
function calculate() {
    if (operator === null || previousInput === null) return;

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":
            if (secondNumber === 0) {
                previousDisplay.textContent =
                    `${previousInput} ÷ ${currentInput} =`;

                currentInput = "Error";
                operator = null;
                previousInput = null;
                shouldReset = true;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    // Avoid long decimal results
    result = Number(result.toPrecision(12));

    previousDisplay.textContent =
        `${previousInput} ${operator} ${currentInput} =`;

    currentInput = String(result);

    operator = null;
    previousInput = null;
    shouldReset = true;

    updateDisplay();
}

// Clear everything
function clearCalculator() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldReset = false;

    previousDisplay.textContent = "";

    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentInput === "Error" || shouldReset) {
        currentInput = "0";
        shouldReset = false;
    } else {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "" || currentInput === "-") {
            currentInput = "0";
        }
    }

    updateDisplay();
}

// Change positive / negative
function changeSign() {
    if (currentInput === "Error") return;

    if (Number(currentInput) !== 0) {
        currentInput = String(Number(currentInput) * -1);
    }

    updateDisplay();
}

// Button events
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelector('[data-action="decimal"]')
    .addEventListener("click", appendDecimal);

document.querySelector('[data-action="equals"]')
    .addEventListener("click", calculate);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);

document.querySelector('[data-action="sign"]')
    .addEventListener("click", changeSign);

// Initial display
updateDisplay();
