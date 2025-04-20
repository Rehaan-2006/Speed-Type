// profile popup

firebase.auth().onAuthStateChanged(user => {
  const navAuth = document.getElementById("nav-auth");
  const navProfile = document.getElementById("nav-profile");
  const profileName = document.getElementById("profile-name");
  const profileTyping = document.getElementById("profile-typing");
  const profileWord = document.getElementById("profile-word");
  const profileUsername = document.getElementById("profile-username");

  if (user) {
    navAuth.classList.add("hidden");
    navProfile.classList.remove("hidden");

    // Fetch user data
    firebase.firestore().collection("users").doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          profileName.innerText = (data.name || user.email).toUpperCase();
          profileUsername.innerText = (data.name || user.email).split("@")[0].toUpperCase();
          profileTyping.innerText = data.typingScore || 0;
          profileWord.innerText = data.wordGuessScore || 0;
        }
      });

    // Toggle dropdown
    const dropdown = document.getElementById("profile-dropdown");
    document.getElementById("nav-profile").addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });

    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      firebase.auth().signOut().then(() => location.reload());
    });
  } else {
    navAuth.classList.remove("hidden");
    navProfile.classList.add("hidden");
  }
});
