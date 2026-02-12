// Firebase imports
import { auth, db } from "./firebase.js";
import { doc, setDoc, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Get form
const form = document.getElementById("profileForm");

// Listen for submit
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page reload

  // 1️⃣ Check login
  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }

  // 2️⃣ Read form values
  const profileData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    emergencyContact: document.getElementById("emergencyContact").value,
    country: document.getElementById("country").value,
    aadhaar: document.getElementById("aadhaar").value,
    bloodGroup: document.getElementById("bloodGroup").value,

    email: user.email,        // from Firebase Auth
    uid: user.uid,
    createdAt: serverTimestamp()
  };

  try {
    // 3️⃣ Save to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      profileData
    );

    alert("✅ Profile saved successfully!");
    window.location.href = "/dashboard.html";

  } catch (error) {
    console.error(error);
    alert("❌ Error saving profile");
  }
});
