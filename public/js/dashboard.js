import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Welcome message logic
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const welcomeEl = document.querySelector(".page-container h2");
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, ${userData.name || 'Traveler'}!`;
    }
  }

  // Load nearby attractions if destination is set
  const destination = localStorage.getItem("selectedDestination");
  if (destination) {
    initTourism(destination);
  }
});

async function initTourism(city) {
  const section = document.getElementById("tourist-section");
  if (!section) return;

  section.style.display = "block";
  const places = await fetchTouristPlaces(city);
  renderTouristCards(places);
}

async function fetchTouristPlaces(city) {
  try {
    const res = await fetch(`/api/tourist/places?city=${city}`);
    if (!res.ok) throw new Error("Failed to fetch places");
    return await res.json();
  } catch (err) {
    console.error("Error fetching tourist places:", err);
    return [];
  }
}

function renderTouristCards(places) {
  const container = document.getElementById("tourist-cards");
  if (!container) return;
  container.innerHTML = "";

  if (places.length === 0) {
    container.innerHTML = "<p>No nearby attractions found.</p>";
    return;
  }

  // Limit to top 3 for dashboard
  places.slice(0, 3).forEach(place => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "0";
    card.innerHTML = `
            <h3>${place.name}</h3>
            <p>📍 ${place.address}</p>
            <p><small>${place.categories}</small></p>
            <button class="btn btn-primary mt-2" style="width: 100%;" onclick="alert('Safety Tips: Stay aware of your surroundings at ${place.name.replace(/'/g, "\\'")}!')">Safety Tips</button>
        `;
    container.appendChild(card);
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.removeItem("selectedDestination");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}
