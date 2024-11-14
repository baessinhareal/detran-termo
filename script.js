// script.js

const words = ["SINAL", "RADAR", "FAIXA", "PISTA", "CURVA", "FAROL", "CINTO", "ACESO", "PLACA", "ROTAS", "FREIO", "MULTA", "SILVO", "APITO", "FLUXO", "VIGOR"]; 
const targetWord = words[Math.floor(Math.random() * words.length)];
let currentGuess = "";
let currentRow = 0;
let gameOver = false;
let results = []; // Array para armazenar resultados de cada linha

const gameBoard = document.getElementById("game-board");

// Criação do tabuleiro com 6 linhas e 5 colunas
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = `row-${i}-col-${j}`;
        gameBoard.appendChild(tile);
    }
}

// Função para quando uma tecla é pressionada
function keyPress(letter) {
    if (currentGuess.length < 5 && !gameOver) {
        currentGuess += letter;
        updateBoard();
    }
}

// Função para apagar uma letra
function deleteLetter() {
    if (!gameOver) {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    }
}

// Função para submeter uma tentativa
function submitGuess() {
    if (currentGuess.length !== 5 || gameOver) {
        alert("A palavra deve ter 5 letras!");
        return;
    }

    let guessArray = currentGuess.split("");
    let targetArray = targetWord.split("");
    let rowResult = ""; // Armazena o resultado da linha para exibir no final

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`row-${currentRow}-col-${i}`);
        const letter = guessArray[i];

        if (letter === targetArray[i]) {
            tile.classList.add("correct");
            rowResult += "🟩";
        } else if (targetArray.includes(letter)) {
            tile.classList.add("present");
            rowResult += "🟨";
        } else {
            tile.classList.add("absent");
            rowResult += "⬜";
            disableKey(letter); // Desativa o botão da letra incorreta
        }
    }

    results.push(rowResult); // Adiciona o resultado da linha ao array de resultados

    if (currentGuess === targetWord) {
        gameOver = true;
        showModal(true);
    } else if (currentRow === 5) {
        gameOver = true;
        showModal(false);
    } else {
        currentRow++;
        currentGuess = "";
    }
}

// Função para atualizar o tabuleiro com as letras inseridas
function updateBoard() {
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`row-${currentRow}-col-${i}`);
        tile.textContent = currentGuess[i] || "";
    }
}

// Função para desativar uma tecla incorreta
function disableKey(letter) {
    const button = document.querySelector(`button[onclick="keyPress('${letter}')"]`);
    if (button) {
        button.disabled = true;
        button.classList.add("disabled");
    }
}

// Função para mostrar o modal de resultado final
function showModal(isWin) {
    const modal = document.getElementById("result-modal");
    const modalText = document.getElementById("modal-text");
    const shareText = `Wordle Clone - ${currentRow + 1}/6\n\n` + results.join("\n");
    modalText.innerHTML = isWin ? "Parabéns! Você acertou!\n\n" + shareText : "Fim de jogo! A palavra era: " + targetWord + "\n\n" + shareText;
    modal.style.display = "block";

    // Configura o botão de copiar
    const copyButton = document.getElementById("copy-button");
    copyButton.onclick = () => copyToClipboard(shareText);
}

// Função para copiar o texto para a área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Resultado copiado para a área de transferência!");
    });
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("result-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
