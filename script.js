/*

    TODO: 
    - Disable decimal point until a new operator is entered
    - Keyboard input
    - Backspace button
*/







const buttonList = [['CLR', 'Backspace', '%', '\u00b1'], ['7','8','9','+'], ['4','5','6','-'], ['1','2','3','\u00d7'], ['0', '.', '=', '\u00f7']]

const buttonPanel = document.querySelector("#button-panel");
const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");

let op1 = "";
let op2 = "";

let result = undefined;
let dpFlag = false; 
let signFlag = true; //true - positive; false - negative
let operatorFlag = false;

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

        if (buttonList[i][j] == '.') {
            btn.setAttribute("id", "decimal-point");
        }

        buttonPanel.appendChild(btn);
    }
}

buttonPanel.addEventListener("click", (e) => {
    if (e.target.classList.contains("number")) {
        expressionDisplay.textContent += e.target.textContent;
    }

    if (e.target.textContent == "CLR") {
        expressionDisplay.textContent = "";
        resultDisplay.textContent = "0";
        op1 = op2 = ""
        result = undefined;
        dpFlag = false; 
        signFlag = true;
        operatorFlag = false;
    }

    if (e.target.classList.contains("operator") && expressionDisplay.textContent.length > 0) {
        operatorFlag = true;
        signFlag = true;

        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent);

        if (opIndex < 0) {
            op1 = expressionDisplay.textContent;
        }
        else {
            if (opIndex == len - 1) {
                expressionDisplay.textContent = expressionDisplay.textContent.substring(0, len - 1)
            }
            else {
                op2 = expressionDisplay.textContent.substring(opIndex + 1, len);
                result = operate(op1, op2, expressionDisplay.textContent[opIndex])
                resultDisplay.textContent = result;
                expressionDisplay.textContent = result;
                op1 = expressionDisplay.textContent;
            }
        }
        expressionDisplay.textContent += e.target.textContent;
    }

    if (e.target.textContent == "=") {
        let opIndex = findOperator(expressionDisplay.textContent)
        op1 = expressionDisplay.textContent.substring(0, opIndex);
        op2 = expressionDisplay.textContent.substring(opIndex + 1);

        if (op1 && op2) {
            let result = operate(op1, op2, expressionDisplay.textContent[opIndex]);
            resultDisplay.textContent = result;
            expressionDisplay.textContent = ""
        }
        else {
            return;
        }
    }

    if (e.target.textContent == '\u00b1' && expressionDisplay.textContent.length > 0) {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent)

        if (opIndex < 0) {
            if (signFlag == true) {
                signFlag = false;
                expressionDisplay.textContent = "-" + expressionDisplay.textContent;
            }
            else {
                signFlag = true;
                expressionDisplay.textContent = expressionDisplay.textContent.substring(1);
            }
        }
        else {
            if (signFlag == true) {
                signFlag = false;
                expressionDisplay.textContent = expressionDisplay.textContent.substring(0, opIndex + 1) + "-" + expressionDisplay.textContent.substring(opIndex + 1);
            }
            else {
                signFlag = true;
                expressionDisplay.textContent = expressionDisplay.textContent.substring(0, opIndex + 1) + expressionDisplay.textContent.substring(opIndex + 2);
            }
        }
    }

    if (e.target.textContent == '.' && dpFlag == false) {
        expressionDisplay.textContent += e.target.textContent;
        dpFlag = true;
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

function operate(num1, num2, op) {
    let parse_num1 = Number(num1);
    let parse_num2 = Number(num2)
    let result = 0;

    switch(op) {
        case "+":
            result = parse_num1 + parse_num2
            return Number.isInteger(result) ? result : Math.round(result * 100) / 100;
        case "\u00d7":
            result = parse_num1 * parse_num2
            return Number.isInteger(result) ? result : Math.round(result * 100) / 100;
        case "\u00f7":
            if (op2 == "0") {
                alert("Division by zero not permitted.");
                return Infinity;
            }
            result = parse_num1 / parse_num2;
            return Number.isInteger(result) ? result : Math.round(result * 100) / 100;
        case "-":
            result = parse_num1 - parse_num2;
            return Number.isInteger(result) ? result : Math.round(result * 100) / 100;
    }
}

function findOperator(str) {
    let idx = undefined;

    for (idx = 0; idx < str.length; idx++) {
        if ((str[idx] == '-' && idx > 0) || str[idx] == '*' || str[idx] == '\u00d7' || str[idx] == '\u00f7' || str[idx] == '+') {
            return idx;
        }
    }

    return -1;
}