function Gameboard() {
  const size = 3;

  const board = [];

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    return board[row][column].addToken(player);
  };

  const cleanBoard = () => {
    board.forEach((row) => row.forEach((cell) => cell.cleanCell()));
  };

  return { getBoard, dropToken, cleanBoard };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    if (value === "") {
      value = player;
      return true;
    } else {
      return false;
    }
  };

  const getValue = () => value;

  const cleanCell = () => (value = "");

  return {
    addToken,
    getValue,
    cleanCell,
  };
}

function GameController() {
  const board = Gameboard();
  const size = board.getBoard().length;

  const getSize = () => size;

  const players = [
    {
      name: "",
      token: "X",
      score: 0,
    },
    {
      name: "",
      token: "O",
      score: 0,
    },
  ];

  let activePlayer = players[0];

  let countMoves = 0;

  let winner = null;
  let winningLine = null;

  const getBoardValues = () =>
    board.getBoard().map((row) => row.map((cell) => cell.getValue()));

  const getPlayersName = () => players.map((player) => player.name);

  const setPlayersName = (nameOne, nameTwo) => {
    players[0].name = nameOne;
    players[1].name = nameTwo;
  };

  const getGameScore = () => [players[0].score, players[1].score];

  const resetGameScore = () => {
    players[0].score = 0;
    players[1].score = 0;
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const resetActivePlayer = () => (activePlayer = players[startingPlayerIndex]);

  let startingPlayerIndex = 0;

  const switchStartingPlayer = () => {
    startingPlayerIndex = startingPlayerIndex === 0 ? 1 : 0;
  };

  const getCountMoves = () => countMoves;

  const resetCountMoves = () => (countMoves = 0);

  const checkLine = (line) => {
    return line.every((cell) => cell !== "" && cell === line[0]);
  };

  const findWinner = () => {
    const boardState = getBoardValues();

    const lines = [];

    boardState.forEach((row, i) => {
      lines.push(row.map((cell, j) => [i, j]));
    });

    for (let i = 0; i < size; i++) {
      lines.push(boardState.map((row, j) => [j, i]));
    }

    lines.push(boardState.map((row, i) => [i, i]));
    lines.push(boardState.map((row, i) => [i, size - 1 - i]));

    for (const coord of lines) {
      const value = coord.map(([i, j]) => boardState[i][j]);

      if (checkLine(value)) {
        const token = value[0];

        winner = players[players.findIndex((player) => player.token === token)];
        players[players.findIndex((player) => player.token === token)].score++;

        winningLine = coord;
        return;
      }
    }
  };

  const getWinner = () => winner;

  const resetWinner = () => {
    winner = null;
    winningLine = null;
  };

  const getWinningLine = () => winningLine;

  const playRound = (row, column) => {
    if (winner || countMoves === size * size) return;

    const success = board.dropToken(row, column, getActivePlayer().token);

    if (!success) return;

    countMoves++;

    findWinner();

    const isBoardFull = countMoves === size * size;

    if (isBoardFull || winner) return;

    switchPlayerTurn();
  };

  return {
    playRound,
    getSize,
    getActivePlayer,
    resetActivePlayer,
    switchStartingPlayer,
    getPlayersName,
    setPlayersName,
    getGameScore,
    resetGameScore,
    getBoardValues,
    findWinner,
    getWinner,
    getWinningLine,
    resetWinner,
    getCountMoves,
    resetCountMoves,
    cleanBoard: board.cleanBoard,
  };
}

function ScreenController() {
  const game = GameController();

  const boardDiv = document.querySelector(".board");

  const actionBtns = document.querySelector(".action");

  const gameInfoDiv = document.querySelector(".game-info");
  const turnInfo = document.querySelector("#turn-info");
  const resultMessage = document.querySelector("#result");
  const score = document.querySelector("#score");

  const windowEnterPlayers = document.querySelector("dialog");
  const formEnterPlayers = windowEnterPlayers.querySelector("form");

  const showWinLine = () => {
    const coordsWin = game.getWinningLine().map((coord) => coord.join(", "));

    for (let coord of coordsWin) {
      boardDiv
        .querySelector(`[data-position="${coord}"]`)
        .classList.add("win-line");
    }
  };

  const updateScreen = () => {
    let names = game.getPlayersName();
    if (names.some((name) => name === "") && !windowEnterPlayers.open) {
      windowEnterPlayers.showModal();
    }

    boardDiv.textContent = "";

    const activePlayer = game.getActivePlayer();

    turnInfo.textContent = `${activePlayer.name}'s (${activePlayer.token}) turn`;

    const scoreValue = game.getGameScore();
    score.textContent = `${names[0]} ${scoreValue[0]} : ${scoreValue[1]} ${names[1]}`;

    game.getBoardValues().forEach((row, indexX) => {
      row.forEach((cell, indexY) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.position = `${indexX}, ${indexY}`;

        const valueSvg = document.createElement("img");
        cellDiv.appendChild(valueSvg);

        if (cell === "X") {
          valueSvg.setAttribute("src", "./cross.svg");
        } else if (cell === "O") {
          valueSvg.setAttribute("src", "./circle.svg");
        }

        boardDiv.appendChild(cellDiv);
      });
    });

    if (game.getWinner() !== null) {
      turnInfo.textContent = "";
      resultMessage.textContent = `${game.getWinner().name} won!`;
      showWinLine();
    }

    if (
      game.getWinner() === null &&
      game.getCountMoves() === game.getSize() * game.getSize()
    ) {
      turnInfo.textContent = "";
      resultMessage.textContent = `You have a draw! Will you play again?`;
    }
  };

  updateScreen();

  function clickHandlerBoard(e) {
    if (game.getWinner() || game.getCountMoves() === game.getSize() ** 2) return;

    const cell = e.target.closest(".cell");
    if (!cell) return;

    const position = cell.dataset.position.split(", ");
    const [positionX, positionY] = position;
    const row = +positionX;
    const col = +positionY;

    game.playRound(row, col);
    updateScreen();
  }

  function resetBoard() {
    game.switchStartingPlayer();
    game.cleanBoard();
    game.resetCountMoves();
    game.resetActivePlayer();
    game.resetWinner();
    resultMessage.textContent = "";
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  actionBtns.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest(".reset")) {
      game.resetGameScore();
      resetBoard();
      return;
    }

    if (target.closest(".edit-players")) {
      game.setPlayersName("", "");
      game.resetGameScore();
      resetBoard();
      return;
    }

    if (target.closest(".next-round")) {
      if (
        game.getWinner() ||
        game.getCountMoves() === game.getSize() * game.getSize()
      ) {
        resetBoard();
        return;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();
    }
  });

  windowEnterPlayers.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(formEnterPlayers);

    const playerOneName = form.get("player-one-name");
    const playerTwoName = form.get("player-two-name");

    game.setPlayersName(playerOneName, playerTwoName);

    updateScreen();
    windowEnterPlayers.close();
    formEnterPlayers.reset();
  });
}

ScreenController();
