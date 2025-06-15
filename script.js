const buttonList = [['CLR', 'Backspace', '%', '\u00b1'], ['7','8','9','+'], ['4','5','6','-'], ['1','2','3','\u00d7'], ['0', '.', '=', '\u00f7']]

const buttonPanel = document.querySelector("#button-panel");
const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");
let expressionStack = []

expressionDisplay.textContent = ""
resultDisplay.textContent = "0"


for (let i = 0; i < buttonList.length; i++) {
    for (let j = 0; j < buttonList[i].length; j++) {
        const btn = document.createElement("button");
        btn.textContent = buttonList[i][j];
        
        if (!isNaN(buttonList[i][j])) {
            btn.classList.add("number")
        }

        if (isOperator(buttonList[i][j])) {
            btn.classList.add("operator");
            btn.setAttribute("id", returnOperator(buttonList[i][j]))
        }

        if (buttonList[i][j] == '=') {
            btn.classList.add("equals");
            btn.style.background = "#FF6961"
        }


        buttonPanel.appendChild(btn);
    }
}

buttonPanel.addEventListener("click", (e) => {
    if (e.target.classList.contains("number")) {
        expressionDisplay.textContent += e.target.textContent;
    }

    if (e.target.textContent == "CLR") {
        expressionDisplay.textContent = ""
    }

    if (e.target.classList.contains("operator")) {
        expressionDisplay.textContent += e.target.textContent;
    }
});

function isOperator(str) {
    return str == '+' || str == '\u00d7' || str == '\u00f7' || str == '-';
}

function returnOperator(str) {
    if (str == '+') {
        return "add";
    }
    else if (str == '\u00d7') {
        return "multiply";
    }
    else if (str == '\u00f7') {
        return "divide";
    }
    else {
        return "subtract"
    }
}

function add(num1, num2) {
    return Number(num1) + Number(num2)
}

function subtract() {

}

function multiply() {

}

function divide() {

}
