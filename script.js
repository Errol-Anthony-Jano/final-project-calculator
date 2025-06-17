const buttonList = [['CLR', 'Backspace', '%', '\u00b1'], ['7','8','9','+'], ['4','5','6','-'], ['1','2','3','\u00d7'], ['0', '.', '=', '\u00f7']]

const buttonPanel = document.querySelector("#button-panel");
const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");

let op1 = undefined;
let op2 = undefined;
let result = undefined;

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
        result = undefined;
        
        while (expressionStack.length > 0) {
            expressionStack.pop()
        }
    }

    if (e.target.classList.contains("operator")) {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperatorIndex(expressionDisplay.textContent);
        op1 = expressionDisplay.textContent.substring(0, opIndex);
        op2 = expressionDisplay.textContent.substring(opIndex + 1, len);

        if (opIndex > -1) {
            result = operate(op1, op2, expressionDisplay.textContent[opIndex])
            resultDisplay.textContent = result;
            expressionDisplay.textContent = result;
        }
        expressionDisplay.textContent += e.target.textContent;
    }

    if (e.target.textContent == "=") {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperatorIndex(expressionDisplay.textContent);
        op1 = expressionDisplay.textContent.substring(0, opIndex);
        op2 = expressionDisplay.textContent.substring(opIndex + 1, len);

        if (opIndex > -1) {
            let result = operate(op1, op2, expressionDisplay.textContent[opIndex]);
            resultDisplay.textContent = result;
            expressionDisplay.textContent = ""
        }
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
    switch(op) {
        case "+":
            return parse_num1 + parse_num2;
        case "\u00d7":
            return parse_num1 * parse_num2;
        case "\u00f7":
            return parse_num1 / parse_num2;
        case "-":
            return parse_num1 - parse_num2;
    }
}

function findOperatorIndex(str) {
    return Math.max(str.indexOf("+"), str.indexOf("-"), str.indexOf("\u00d7"), str.indexOf("\u00f7"))
}