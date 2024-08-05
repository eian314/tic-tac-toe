document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const playerLabel = document.querySelector(".player-label");
    const startButton = document.querySelector(".start-button");
    const board = document.querySelector(".board");
    let currentPlayer = "Player 1";
    let lastTurnIndex = null;
    let gameActive = false;

    const startGame = () => {
        currentPlayer = "Player 1";
        playerLabel.textContent = "Player 1's Turn";
        playerLabel.style.color = "red";
        lastTurnIndex = null;
        gameActive = true;
        board.classList.add("active");
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("red", "blue", "completed");
        });
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";
        playerLabel.textContent = `${currentPlayer}'s Turn`;
        playerLabel.style.color = currentPlayer === "Player 1" ? "red" : "blue";
    };

    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a].textContent === "T" && cells[b].textContent === "T" && cells[c].textContent === "T" &&
                cells[a].classList.contains("completed") && cells[b].classList.contains("completed") && cells[c].classList.contains("completed")) {
                playerLabel.textContent = `${currentPlayer} Wins!`;
                playerLabel.style.color = "green";
                gameActive = false;
                board.classList.remove("active");
                return true;
            }
        }
        return false;
    };

    const generateMathProblem = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
        let answer;
        switch (operator) {
            case "+":
                answer = math.add(num1, num2);
                break;
            case "-":
                answer = math.subtract(num1, num2);
                break;
            case "*":
                answer = math.multiply(num1, num2);
                break;
            case "/":
                answer = math.floor(math.divide(num1, num2));
                break;
        }
        return { problem: `${num1} ${operator} ${num2} = ?`, answer: answer.toString() };
    };

    const cellClickHandler = (e) => {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (!gameActive || cell.classList.contains("completed")) return;

        if (cell.textContent === "") {
            const { problem, answer } = generateMathProblem();
            const userAnswer = prompt(problem);

            if (userAnswer === answer) {
                cell.classList.add("correct-answer");
                setTimeout(() => {
                    cell.classList.remove("correct-answer");
                    const lineType = prompt("Add vertical or horizontal line? (v/h)");
                    if (lineType === "v") {
                        cell.textContent = "|";
                        cell.classList.add(currentPlayer === "Player 1" ? "red" : "blue");
                        lastTurnIndex = index;
                        switchPlayer();
                    } else if (lineType === "h") {
                        cell.textContent = "—";
                        cell.classList.add(currentPlayer === "Player 1" ? "red" : "blue");
                        lastTurnIndex = index;
                        switchPlayer();
                    }
                }, 500);
            } else {
                cell.classList.add("incorrect-answer");
                setTimeout(() => {
                    cell.classList.remove("incorrect-answer");
                    alert("Incorrect answer! Turn lost.");
                    switchPlayer();
                }, 500);
            }
        } else if ((cell.textContent === "|" || cell.textContent === "—") && index !== lastTurnIndex) {
            const { problem, answer } = generateMathProblem();
            const userAnswer = prompt(problem);

            if (userAnswer === answer) {
                cell.classList.add("correct-answer");
                setTimeout(() => {
                    cell.classList.remove("correct-answer");
                    cell.textContent = "T";
                    cell.classList.remove("red", "blue");
                    cell.classList.add("completed");
                    if (!checkWin()) {
                        switchPlayer();
                    }
                }, 500);
            } else {
                cell.classList.add("incorrect-answer");
                setTimeout(() => {
                    cell.classList.remove("incorrect-answer");
                    alert("Incorrect answer! Turn lost.");
                    switchPlayer();
                }, 500);
            }
        }
    };

    startButton.addEventListener("click", startGame);
    cells.forEach(cell => cell.addEventListener("click", cellClickHandler));

    // Set initial player label color to black when the game first loads
    playerLabel.style.color = "black";
});
