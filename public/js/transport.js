import { fetchDepartures, renderFlightCards } from "./flights.js";
import { fetchTrains, renderTrainCards } from "./trains.js";

const city = localStorage.getItem("selectedDestination");

document.addEventListener('DOMContentLoaded', () => {
    if (!city) {
        alert("Please select destination first.");
        window.location.href = "dashboard.html";
        return;
    }

    updateTransportInfo(city);
    setupFlightSearch();
    setupTrainSearch();
});

function setupFlightSearch() {
    const searchBtn = document.getElementById("searchFlightBtn");
    const iataInput = document.getElementById("iataInput");

    if (searchBtn && iataInput) {
        searchBtn.addEventListener("click", async () => {
            const iata = iataInput.value.trim();
            if (!iata) {
                alert("Please enter an IATA code.");
                return;
            }

            searchBtn.disabled = true;
            searchBtn.textContent = "Searching...";

            const flights = await fetchDepartures(iata);
            renderFlightCards(flights);

            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        });

        iataInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchBtn.click();
        });
    }
}

function setupTrainSearch() {
    const searchBtn = document.getElementById("searchTrainBtn");
    const fromInput = document.getElementById("trainFrom");
    const toInput = document.getElementById("trainTo");
    const dateInput = document.getElementById("trainDate");

    // Set default date to today
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (searchBtn && fromInput && toInput && dateInput) {
        searchBtn.addEventListener("click", async () => {
            const from = fromInput.value.trim();
            const to = toInput.value.trim();
            const date = dateInput.value;

            if (!from || !to || !date) {
                alert("Please fill all fields for train search.");
                return;
            }

            searchBtn.disabled = true;
            searchBtn.textContent = "Searching...";

            const trains = await fetchTrains(from, to, date);
            renderTrainCards(trains);

            searchBtn.disabled = false;
            searchBtn.textContent = "Find Trains";
        });
    }
}

function updateTransportInfo(cityName) {
    const cards = document.querySelectorAll(".grid .card");

    // Update the other half-empty cards
    // 0 is Flight Search (Manual HTML)
    // 1 is Train Search (Manual HTML)
    // 2 is Bus
    // 3 is Car

    if (cards[2]) { // Bus
        cards[2].innerHTML = `
            <h3>🚌 Bus to ${cityName}</h3>
            <p>View state transport and private bus routes to ${cityName}.</p>
            <button class="btn btn-primary mt-4" onclick="window.open('https://www.google.com/search?q=bus+to+${cityName}')">View Buses</button>
        `;
    }

    if (cards[3]) { // Car
        cards[3].innerHTML = `
            <h3>🚗 Car Rental in ${cityName}</h3>
            <p>Hire a private taxi or rent a car for a comfortable local stay in ${cityName}.</p>
            <button class="btn btn-primary mt-4" onclick="window.open('https://www.google.com/search?q=car+rental+in+${cityName}')">Rent a Car</button>
        `;
    }
}
