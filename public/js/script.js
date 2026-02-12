import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// LOGIN BUTTON
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.removeItem("selectedDestination"); // force new selection
    alert("Login successful!");

    // Switch to Route Selection instead of redirecting
    document.getElementById("authWrapper").style.display = "none";
    document.getElementById("routeWrapper").style.display = "flex";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

window.showAuth = function () {
  document.getElementById("authWrapper").style.display = "flex";
  document.getElementById("routeWrapper").style.display = "none";
};

// REGISTER BUTTON - Toggle Register Box
document.getElementById("registerBtn").addEventListener("click", () => {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
});

// BACK BUTTON - Toggle back to Login
document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("registerBox").style.display = "none";
});

// REGISTER FUNCTION
window.register = async function () {

  // 1️⃣ Get values from input fields
  const name = document.getElementById("name").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const aadhaar = document.getElementById("aadhaar").value;
  const bloodGroup = document.getElementById("bloodGroup").value;
  const phone = document.getElementById("phone").value;
  const emergency = document.getElementById("emergency").value;
  const country = document.getElementById("country").value;
  if (!name || !email || !password || !aadhaar || !bloodGroup || !phone || !emergency || !country) {
    alert("Please fill all fields");
    return;
  }

  // Aadhaar basic validation (12 digits) and blood group selection
  if (aadhaar.length !== 12 || isNaN(aadhaar)) {
    alert("Enter valid 12-digit Aadhaar number");
    return;
  }

  if (!bloodGroup) {
    alert("Please select blood group");
    return;
  }

  try {
    // 2️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 3️⃣ Save extra data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      phone: phone,
      emergencyContact: emergency,
      country: country,
      aadhaar: aadhaar,
      bloodGroup: bloodGroup,
      createdAt: new Date()
    });

    alert("Registration successful & profile saved!");
    // Toggle back to login
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
};
