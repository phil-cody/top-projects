let humanScore = 0;
let computerScore = 0;
let roundNumber = 1;

const choiceArr = document.querySelector(".choice");
const resultMessage = document.querySelector(".result");
const roundNumberContent = document.querySelector(".result__round-number");
const startOver = document.querySelector("#restart__button");

const resultScore = document.createElement("p");
const resultChoice = document.createElement("p");
const resultRound = document.createElement("p");

const wonMessage = document.createElement("p");
const loseMessage = document.createElement("p");

wonMessage.textContent = "You won! Congratulations!";
wonMessage.classList.add('result__winner');

loseMessage.textContent = "Oh, maybe you`ll be lucky next time :)";
loseMessage.classList.add('result__loser');

function getComputerChoice() {
  let optionsArr = ["Rock", "Paper", "Scissors"];
  let indexOptions = Math.floor(Math.random() * 3);

  return optionsArr[indexOptions];
}

function playRound(humanChoice, computerChoice) {
  let optionsArr = ["Rock", "Paper", "Scissors"];
  let resultArr = ["Draw! You think the same", "You lose!", "You won!"];

  const humanRock = humanChoice === optionsArr[0];
  const humanPaper = humanChoice === optionsArr[1];
  const humanScissors = humanChoice === optionsArr[2];

  const computerRock = computerChoice === optionsArr[0];
  const computerPaper = computerChoice === optionsArr[1];
  const computerScissors = computerChoice === optionsArr[2];

  if (humanChoice === computerChoice) {
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[0]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanRock && computerPaper) {
    computerScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[1]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanRock && computerScissors) {
    humanScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[2]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanPaper && computerRock) {
    humanScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[2]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanPaper && computerScissors) {
    computerScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[1]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanScissors && computerRock) {
    computerScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[1]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  } else if (humanScissors && computerPaper) {
    humanScore++;
    roundNumberContent.textContent = `Round ${roundNumber}`;
    resultChoice.textContent = `You : ${humanChoice} | ${computerChoice} : Computer`;
    resultRound.textContent = `${resultArr[2]}`;
    resultScore.textContent = `Player : ${humanScore} | ${computerScore} : Computer`;
  }

  roundNumber++;
}

function playGame(event) {
  let target = event.target;

  let playerChoice = target.id.charAt(0).toUpperCase() + target.id.slice(1);

  playRound(playerChoice, getComputerChoice());

  if (resultRound.textContent === 'You won!' && !resultRound.classList.contains('result__winner')) {
    resultRound.classList.remove('result__loser');
    resultRound.classList.remove('result__default');
    resultRound.classList.add('result__winner');
  } else if (resultRound.textContent === 'You lose!' && !resultRound.classList.contains('result__loser')) {
    resultRound.classList.remove('result__winner');
    resultRound.classList.remove('result__default');
    resultRound.classList.add('result__loser');
  } else  if (resultRound.textContent === 'Draw! You think the same' && !resultRound.classList.contains('result__default')) {
    resultRound.classList.remove('result__winner');
    resultRound.classList.remove('result__loser');
    resultRound.classList.add('result__default');
  }

  resultMessage.appendChild(resultChoice);
  resultMessage.appendChild(resultRound);
  resultMessage.appendChild(resultScore);

  if (humanScore >= 5) {
    choiceArr.removeEventListener("click", playGame);
    resultMessage.appendChild(wonMessage);
  } else if (computerScore >= 5) {
    choiceArr.removeEventListener("click", playGame);
    resultMessage.appendChild(loseMessage);
  }
}

choiceArr.addEventListener("click", playGame);

startOver.addEventListener("click", () => {
  humanScore = 0;
  computerScore = 0;
  roundNumber = 1;

  roundNumberContent.textContent = `Are you sure you're ready to repeat it?`;
  resultScore.remove();
  resultChoice.remove();
  resultRound.remove();

  if (
    resultMessage.lastElementChild === wonMessage ||
    resultMessage.lastElementChild === loseMessage
  ) {
    resultMessage.lastElementChild.remove();
  }

  choiceArr.addEventListener("click", playGame);
});
