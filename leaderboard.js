
  //const db = firebase.firestore();
  
  const typingBtn = document.getElementById("typingBtn");
  const guessingBtn = document.getElementById("guessingBtn");
  const title = document.getElementById("leaderboard-title");
  const list = document.getElementById("leaderboard-list");
  
  // Initial load: Typing Game
  loadLeaderboard("typingScore");
  
  typingBtn.onclick = () => {
    typingBtn.classList.add("active");
    guessingBtn.classList.remove("active");
    title.textContent = "Typing Game Leaderboard";
    loadLeaderboard("typingScore");
  };
  
  guessingBtn.onclick = () => {
    guessingBtn.classList.add("active");
    typingBtn.classList.remove("active");
    title.textContent = "Word Guessing Game Leaderboard";
    loadLeaderboard("wordGuessScore");
  };
  
  function loadLeaderboard(scoreType) {
    list.innerHTML = "";
    db.collection("users")
      .orderBy(scoreType, "desc")
      .limit(10)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const user = doc.data();
          const li = document.createElement("li");
          li.textContent = `${user.name || user.email} — ${user[scoreType] || 0} points`;
          list.appendChild(li);
        });
      });
  }
  