/*
    TODO: 
    - Disable decimal point until a new operator is entered (done)
    - Keyboard input
    - Backspace button (done) 
    - Prevent display overflow
*/
const buttonList = [['CLR', 'BKSP', 'INFO', '\u00b1'], ['7','8','9','+'], ['4','5','6','-'], ['1','2','3','\u00d7'], ['0', '.', '=', '\u00f7']]

const buttonPanel = document.querySelector("#button-panel");
const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");
const MAX_LENGTH = 24;
const MAX_RESULT_DISPLAY = 15;

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
        
        if (i == 0) {
            btn.classList.add("functions")
        }
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

document.addEventListener("keypress", (e) => {
    let isKeyNumeric = !isNaN(e.key);
    let isKeyOperator = isOperator(e.key);

    if (expressionDisplay.textContent.length >= MAX_LENGTH && (isKeyNumeric || isKeyOperator)) {
        alert("Error: Display limit has been reached.");
        return;
    }

    if (isKeyNumeric) {
        expressionDisplay.textContent += e.key;
    }
    else if (isKeyOperator && expressionDisplay.textContent.length > 0) {
        operatorFlag = true;
        signFlag = true;

        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent);

        let dsp = splitExpression(expressionDisplay.textContent, resultDisplay.textContent, opIndex, len);


        expressionDisplay.textContent = dsp[0];
        resultDisplay.textContent = dsp[1];
        
        let displayOperator = '';

        if (e.key == '*') {
            displayOperator = '\u00d7';
        }
        else if (e.key == '/') {
            displayOperator = '\u00f7';
        }
        else {
            displayOperator = e.key;
        }

        if (dsp[0].length > 0) {
            expressionDisplay.textContent += displayOperator;
        }
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key == 'Backspace') {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent);

        expressionDisplay.textContent = backspace(expressionDisplay.textContent, len, opIndex);        

        opIndex = findOperator(expressionDisplay.textContent)
        opIndex < 0 ? operatorFlag = false : operatorFlag = true;
    }
    else if (e.key == 'Delete') {
        expressionDisplay.textContent = '';
        resultDisplay.textContent = '0';
    }
    else if (e.key == 'Enter') {
        let opIndex = findOperator(expressionDisplay.textContent)
        op1 = expressionDisplay.textContent.substring(0, opIndex);
        op2 = expressionDisplay.textContent.substring(opIndex + 1);

        resultDisplay.textContent = equalsProcedure(expressionDisplay.textContent, op1, op2, opIndex);
        expressionDisplay.textContent = "";
    }
});

buttonPanel.addEventListener("click", (e) => {
    if (expressionDisplay.textContent.length >= MAX_LENGTH && (e.target.classList.contains("number") || e.target.classList.contains("operator"))) {
        alert("Error: Display limit has been reached.");
        return;
    }
    
    if (e.target.classList.contains("number")) {
        expressionDisplay.textContent += e.target.textContent;
    }

    if (e.target.textContent == "CLR") {
        expressionDisplay.textContent = "";
        resultDisplay.textContent = "0";
        op1 = op2 = "";
        result = undefined;
        dpFlag = false; 
        signFlag = true;
        operatorFlag = false;
    }

    if (e.target.textContent == "BKSP" && expressionDisplay.textContent.length > 0) {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent);

        expressionDisplay.textContent = backspace(expressionDisplay.textContent, len, opIndex);        

        opIndex = findOperator(expressionDisplay.textContent)
        opIndex < 0 ? operatorFlag = false : operatorFlag = true;
    }

    if (e.target.classList.contains("operator") && expressionDisplay.textContent.length > 0) {
        operatorFlag = true;
        signFlag = true;

        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent);

        let dsp = splitExpression(expressionDisplay.textContent, resultDisplay.textContent, opIndex, len);


        expressionDisplay.textContent = dsp[0];
        resultDisplay.textContent = dsp[1];

        if (dsp[0].length > 0) {
            expressionDisplay.textContent += e.target.textContent;
        }
    }

    if (e.target.textContent == "=") {
        let opIndex = findOperator(expressionDisplay.textContent)
        op1 = expressionDisplay.textContent.substring(0, opIndex);
        op2 = expressionDisplay.textContent.substring(opIndex + 1);

        resultDisplay.textContent = equalsProcedure(expressionDisplay.textContent, op1, op2, opIndex);
        expressionDisplay.textContent = "";
    }

    if (e.target.textContent == '\u00b1' && expressionDisplay.textContent.length > 0) {
        let len = expressionDisplay.textContent.length;
        let opIndex = findOperator(expressionDisplay.textContent)

        expressionDisplay.textContent = toggleSignFlag(expressionDisplay.textContent, opIndex);
    }

    if (e.target.textContent == '.' && dpFlag == false) {
        expressionDisplay.textContent += e.target.textContent;
        dpFlag = true;
    }

    if (e.target.textContent == 'INFO') {
        alert("Calculator by Errol");
    }
});

function isOperator(str) {
    return str == '+' || str == '\u00d7' || str == '\u00f7' || str == '-' || str == '*' || str == '/';
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
        case "*":
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

function backspace(str, len, opIndex) {
    if (str[len - 2] == '-' && len - 2 != opIndex) {
        str = str.substring(0, len - 2);
    }
    else {
        str = str.substring(0, len - 1);
    }

    return str;
}

function equalsProcedure(expression, op1, op2, opIndex) {
    if (op1 && op2) {
        let result = operate(op1, op2, expression[opIndex]);
        return result;
    }
}

function toggleSignFlag(expression, opIndex) {
    if (opIndex < 0) {
        if (signFlag == true) {
            signFlag = false;
            expression = "-" + expression;
        }
        else {
            signFlag = true;
            expression = expression.substring(1);
        }
    }
    else {
        if (signFlag == true) {
            signFlag = false;
            expression = expression.substring(0, opIndex + 1) + "-" + expression.substring(opIndex + 1);
        }
        else {
            signFlag = true;
            expression = expression.substring(0, opIndex + 1) + expression.substring(opIndex + 2);
        }
    }

    return expression;
}

function splitExpression(expression, resultStr, opIndex, len) {
    let res = [];
    if (opIndex < 0) {
        return [expression, resultStr];
    }
    else {
        expression[opIndex] == len - 1 ? expression.substring(0, len - 1) : res = cascadeOperation(expression, resultStr, opIndex, len)
    }

    return res;
}

function cascadeOperation(expression, resultStr, opIndex, len) {
    op1 = expression.substring(0, opIndex);
    op2 = expression.substring(opIndex + 1, len);
    result = operate(op1, op2, expression[opIndex])
    //put in separate method
    if (result == Infinity) {
        return ['', '0'];
    }
    else if (result.toString().length >= MAX_RESULT_DISPLAY) {
        alert("Maximum digits has been reached.");
        return ['', '0'];
    }
    else {
        resultStr = expression = result;
    }

    return [result, result];
}