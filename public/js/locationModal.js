let activeInput = null;

function handleSearch(input, type) {
    activeInput = type;
    searchCity(input.value);
}

function setLoc(city) {
    if (activeInput === 'source') {
        document.getElementById("sourceInput").value = city;
    } else if (activeInput === 'dest') {
        document.getElementById("destInput").value = city;
    } else {
        // Default behavior if nothing focused: fill Source first, then Dest
        if (!document.getElementById("sourceInput").value) {
            document.getElementById("sourceInput").value = city;
        } else {
            document.getElementById("destInput").value = city;
        }
    }
    document.getElementById("citySuggestions").style.display = "none";
}

function confirmRoute() {
    const source = document.getElementById("sourceInput").value;
    const dest = document.getElementById("destInput").value;

    if (!source || !dest) {
        alert("Please select both source and destination");
        return;
    }

    localStorage.setItem("selectedSource", source);
    localStorage.setItem("selectedDestination", dest);

    // Dispatch event for other pages
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: { city: dest } }));

    window.location.href = "dashboard.html";
}

/* Existing Search logic modified for standalone use */
async function searchCity(q) {
    if (!q || q.length < 2) {
        document.getElementById("citySuggestions").innerHTML = "";
        document.getElementById("citySuggestions").style.display = "none";
        return;
    }

    try {
        const res = await fetch(`/api/locations?q=${q}`);
        const data = await res.json();

        const list = document.getElementById("citySuggestions");
        list.innerHTML = "";
        list.style.display = "block";

        if (data.results && data.results.length > 0) {
            data.results.forEach(place => {
                const li = document.createElement("li");
                li.textContent = place.name;
                li.onclick = () => {
                    setLoc(place.name);
                };
                list.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Search error", err);
    }
}

/* Detect user location for source */
function detectLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
            const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data.city) {
                document.getElementById("sourceInput").value = data.city;
            } else {
                alert("City not found for your location.");
            }
        } catch (err) {
            console.error("Geocoding failed", err);
            alert("Could not detect location.");
        }
    });
}

// Make functions available globally
window.handleSearch = handleSearch;
window.setLoc = setLoc;
window.confirmRoute = confirmRoute;
window.detectLocation = detectLocation;
