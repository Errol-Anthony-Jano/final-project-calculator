const buttonList = [['CLR', 'Backspace', '%', '\u002b'], ['7','8','9','+'], ['4','5','6','-'], ['1','2','3','\u00d7'], ['0', '.', '=', '\u00f7']]

const buttonPanel = document.querySelector("#button-panel");



for (let i = 0; i < buttonList.length; i++) {
    for (let j = 0; j < buttonList[i].length; j++) {
        const btn = document.createElement("button");
        btn.textContent = buttonList[i][j];
        buttonPanel.appendChild(btn);
    }
}
