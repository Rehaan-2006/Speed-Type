// 👉 Firebase config (replace these with your actual Firebase project settings)
const firebaseConfig = {
  apiKey: "AIzaSyAgCDPyMQ_SE5pFfFv1GJs129WJeS1laHw",
  authDomain: "speed-type-3444d.firebaseapp.com",
  projectId: "speed-type-3444d",
  storageBucket: "speed-type-3444d.firebasestorage.app",
  messagingSenderId: "622941597803",
  appId: "1:622941597803:web:736e159c8577dadf2b012e"
  };
  
  // 👉 Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // 👉 Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Logged in:", userCredential.user);
          // Redirect to home or game page
          window.location.href = "index.html";
        })
        .catch((error) => {
          // Check if error has a structured JSON response
          if (error.message.includes("INVALID_LOGIN_CREDENTIALS")) {
            alert("Incorrect email or password. Please try again.");
          } else {
            alert("Login failed. " + error.message);
          }
        });
    });
  }
  
  // 👉 Signup
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;
  
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
  
          // Optionally store additional user info in Firestore
          return db.collection("users").doc(user.uid).set({
            name: name,
            email: email,
            createdAt: new Date()
          });
        })
        .then(() => {
          console.log("User signed up and data saved.");
          // Redirect to home or login page
          window.location.href = "login.html";
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            alert("An account with this email already exists.");
          } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
          } else if (error.code === "auth/weak-password") {
            alert("Password should be at least 6 characters.");
          } else {
            alert("Signup failed: " + error.message);
          }
        });
    });
  }
  
