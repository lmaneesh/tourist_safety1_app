import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    loadProfile(user.uid);
});

async function loadProfile(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Display View
            document.getElementById("name").textContent = data.name || "N/A";
            document.getElementById("email").textContent = data.email || "N/A";
            document.getElementById("phone").textContent = data.phone || "N/A";
            document.getElementById("emergency").textContent = data.emergencyContact || "N/A";
            document.getElementById("country").textContent = data.country || "N/A";
            document.getElementById("aadhaar").textContent = data.aadhaar || "N/A";
            document.getElementById("bloodGroup").textContent = data.bloodGroup || "N/A";

            // Populate Edit Form
            document.getElementById("editName").value = data.name || "";
            document.getElementById("editPhone").value = data.phone || "";
            document.getElementById("editEmergency").value = data.emergencyContact || "";
            document.getElementById("editCountry").value = data.country || "";
            document.getElementById("editAadhaar").value = data.aadhaar || "";
            document.getElementById("editBloodGroup").value = data.bloodGroup || "";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

const saveBtn = document.getElementById("saveProfileBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) return;

        const updatedData = {
            name: document.getElementById("editName").value,
            phone: document.getElementById("editPhone").value,
            emergencyContact: document.getElementById("editEmergency").value,
            country: document.getElementById("editCountry").value,
            aadhaar: document.getElementById("editAadhaar").value,
            bloodGroup: document.getElementById("editBloodGroup").value
        };

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, updatedData);
            alert("Profile updated successfully!");
            location.reload(); // Refresh to show updated data
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    });
}
