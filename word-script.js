
const inputs = document.querySelector(".inputs");
const resetBtn = document.querySelector(".reset-btn");
const startBtn = document.querySelector(".start-btn");
const hint = document.querySelector(".hint span");
const guess = document.querySelector(".guess-left span");
const wrongLetter = document.querySelector(".wrong-letter span");
const typingInput = document.querySelector(".typing-input");
const scoreDisplay = document.querySelector(".score span");
const timerDisplay = document.querySelector(".timer span");
const correctPopup = document.querySelector(".correct-popup");
const endPopup = document.querySelector(".end-popup");

let shuffledWords = [];
let currentIndex = 0;

function shuffleWordList() {
    shuffledWords = [...wordList].sort(() => 0.5 - Math.random());
    currentIndex = 0;
}

function getNextWord() {
    if (currentIndex >= shuffledWords.length) {
        shuffleWordList(); // Reshuffle when all words are used
    }
    return shuffledWords[currentIndex++];
}

let word, maxGuesses, incorrects = [], corrects = [];
let score = 0;
let wordsGuessed = 0;
let gameOver = true;
let timeLeft = 90;
let timer;

function randomWord() {
    const ranObj = getNextWord(); // <-- uses the shuffled list now
    word = ranObj.word.toLowerCase();
    maxGuesses = 5;
    corrects = [];
    incorrects = [];

    hint.innerHTML = ranObj.hint;
    guess.innerHTML = maxGuesses;
    wrongLetter.innerText = incorrects;

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += '<input type="text" disabled>';
    }
    inputs.innerHTML = html;
}

function showPopup(popup, message) {
    popup.querySelector("p").innerText = message;
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("hidden"), 2000);
}

function showEndPopup(message) {
    endPopup.querySelector("p").innerText = message;
    endPopup.classList.remove("hidden");
}

function endGame(message) {
    clearInterval(timer);
    gameOver = true;
    showEndPopup(`${message}\nWords Guessed: ${wordsGuessed}\nScore: ${score}`);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const userRef = firebase.firestore().collection("users").doc(user.uid);
      
          userRef.get().then(doc => {
            const data = doc.data();
            const currentScore = data.wordGuessScore || 0;
      
            if (score > currentScore) {
              userRef.update({
                wordGuessScore: score
              }).then(() => {
                console.log("Word guess score updated in Firestore!");
              }).catch(err => {
                console.error("Error updating word guess score:", err);
              });
            }
          });
        }
      });

}

function initGame(e) {
    if (gameOver) return;

    let key = e.target.value.toLowerCase();
    if (key.match(/^[a-z]$/) && !incorrects.includes(" " + key) && !corrects.includes(key)) {
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    corrects.push(key);
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
        } else {
            maxGuesses--;
            incorrects.push(" " + key);
        }

        wrongLetter.innerText = incorrects;
        guess.innerHTML = maxGuesses;
    }

    typingInput.value = "";

    setTimeout(() => {
        const uniqueCorrects = [...new Set(corrects)];
        if (uniqueCorrects.length === new Set(word).size) {
            score += maxGuesses * 5;
            scoreDisplay.innerText = score;
            wordsGuessed++;
            showPopup(correctPopup, `Nice! You guessed: ${word.toUpperCase()}`);
            randomWord();
        } else if (maxGuesses < 1) {
            for (let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
            endGame(`You failed to guess the word: ${word.toUpperCase()}`);
        }
    });
}

function startTimer() {
    timeLeft = 90;
    timerDisplay.innerText = timeLeft;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
        } else {
            endGame("Time's up!");
        }
    }, 1000);
}

resetBtn.addEventListener("click", () => window.location.reload());
startBtn.addEventListener("click", () => {
    score = 0;
    wordsGuessed = 0;
    scoreDisplay.innerText = score;
    gameOver = false;

    shuffleWordList();
    startTimer();
    randomWord();
    typingInput.focus();
});

typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());
