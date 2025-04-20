const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".content button"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span"),
endPopup = document.querySelector(".end-popup"),
summaryText = document.querySelector(".summary-text");

let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        typingText.innerHTML += `<span>${char}</span>`;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}


function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = (wpm < 0 || !wpm || wpm === Infinity) ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        showEndPopup();
        inpField.value = "";
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    endPopup.classList.add("hidden");
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

function showEndPopup() {
    const finalWPM = wpmTag.innerText;
    const finalCPM = cpmTag.innerText;
    const finalMistakes = mistakeTag.innerText;
    const score = +finalWPM;

    let message = "Awesome job!";
    if (finalWPM < 20) {
        message = "Keep practicing! You’ll get faster.";
    } else if (finalWPM > 60) {
        message = "Blazing fast! Impressive.";
    }

    summaryText.innerHTML = `WPM: <b>${finalWPM}</b><br>CPM: <b>${finalCPM}</b><br>Mistakes: <b>${finalMistakes}</b><br><br>${message}`;
    endPopup.classList.remove("hidden"); // <-- shows the popup

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const userRef = firebase.firestore().collection("users").doc(user.uid);
      
          userRef.get().then(doc => {
            const data = doc.data();
            const currentScore = data.typingScore || 0;
      
            if (score > currentScore) {
              userRef.update({
                typingScore: score
              }).then(() => {
                console.log("Typing score updated in Firestore!");
              }).catch(err => {
                console.error("Error updating score:", err);
              });
            }
          });
        }
      });

}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
        showEndPopup(); // ✅ Always call popup when timer runs out!
    }
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
