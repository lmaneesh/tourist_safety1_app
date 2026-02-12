const city = localStorage.getItem("selectedDestination");

document.addEventListener('DOMContentLoaded', () => {
    if (!city) {
        alert("Please select destination first.");
        window.location.href = "dashboard.html";
        return;
    }

    fetchPlaces(city);
    fetchCottages(city);
});

async function fetchPlaces(cityName) {
    try {
        const res = await fetch(`/api/tourist/places?city=${cityName}`);
        const data = await res.json();

        const grid = document.getElementById("placesGrid");
        if (!grid) return;

        grid.innerHTML = "";

        if (data.length > 0) {
            data.forEach(place => {
                const card = document.createElement("div");
                card.className = "card";
                card.style.marginBottom = "0";
                card.innerHTML = `
          <h3>${place.name}</h3>
          <p>⭐ Rating: ${place.rating}</p>
          <p>📍 ${place.address}</p>
          <p><small>${place.categories}</small></p>
          <button class="btn btn-primary mt-4" style="width: 100%;" onclick="alert('Safety Tips: Always keep your belongings close and stay in well-lit areas at ${place.name.replace(/'/g, "\\'")}!')">Safety Tips</button>
        `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = "<p>No famous places found for this location.</p>";
        }
    } catch (error) {
        console.error("Places fetch failed:", error);
    }
}

async function fetchCottages(cityName) {
    try {
        const res = await fetch(`/api/tourist/cottages?city=${cityName}`);
        const data = await res.json();

        const grid = document.getElementById("cottagesGrid");
        if (!grid) return;

        grid.innerHTML = "";

        if (data.length > 0) {
            data.forEach(cottage => {
                const card = document.createElement("div");
                card.className = "card";
                card.style.marginBottom = "0";
                card.innerHTML = `
          <h3>${cottage.name}</h3>
          <p>📍 ${cottage.address}</p>
          <p>💰 ${cottage.price}</p>
          <button class="btn btn-primary mt-4" style="width: 100%;">Book Now</button>
          <button class="btn btn-outline mt-2" style="width: 100%;" onclick="alert('Safety Tips: Check reviews and verify the location of ${cottage.name.replace(/'/g, "\\'")} before booking.')">Safety Tips</button>
        `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = "<p>No budget cottages found for this location.</p>";
        }
    } catch (error) {
        console.error("Cottages fetch failed:", error);
    }
}
