import { auth, db } from "./firebase.js";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const sosBtn = document.getElementById("mainSosBtn"); // ID used in dashboard.html
  if (sosBtn) {
    sosBtn.addEventListener("click", triggerSOS);
  }
});

async function triggerSOS() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  const confirmSOS = confirm("🚨 Are you sure you want to trigger an SOS Emergency Alert?");
  if (!confirmSOS) return;

  alert("🚨 Sending SOS Alert... Please stay calm.");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const user = auth.currentUser;
      const city = localStorage.getItem("selectedDestination");

      if (!user) {
        alert("Please log in to use SOS feature.");
        return;
      }

      try {
        // Get user details from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: "Unknown User" };

        // 1. Save to Firestore for record
        await addDoc(collection(db, "sos_alerts"), {
          userId: user.uid,
          userName: userData.name,
          userPhone: userData.phone || "N/A",
          location: { lat: latitude, lon: longitude },
          city: city || "Unknown",
          timestamp: serverTimestamp(),
          status: "PENDING"
        });

        // 2. Call backend SOS API
        const response = await fetch("/api/emergency/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            userName: userData.name,
            location: { lat: latitude, lon: longitude },
            city: city
          })
        });

        const result = await response.json();
        if (result.success) {
          alert("✅ " + result.message);
        } else {
          alert("⚠️ SOS logged, but failed to notify authorities via API.");
        }

      } catch (error) {
        console.error("SOS failed:", error);
        alert("❌ Critical Error: Failed to send SOS alert. Please call local emergency services directly.");
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("❌ Could not get your current location. SOS alert was NOT sent.");
    }
  );
}
