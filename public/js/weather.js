const city = localStorage.getItem("selectedDestination");

document.addEventListener('DOMContentLoaded', () => {
    if (city) {
        // Auto-fetch for selected destination
        fetchWeather(city);
    }

    // Manual search functionality
    const getWeatherBtn = document.getElementById("getWeatherBtn");
    const cityInput = document.getElementById("cityInput");
    if (getWeatherBtn && cityInput) {
        getWeatherBtn.addEventListener('click', () => {
            const searchCity = cityInput.value.trim();
            if (searchCity) fetchWeather(searchCity);
        });
    }

    // Listen for global location changes from the modal
    window.addEventListener('locationChanged', (e) => {
        console.log("Weather page received location update:", e.detail.city);
        if (e.detail.city) {
            fetchWeather(e.detail.city);
        }
    });
});

async function fetchWeather(cityName) {
    try {
        const res = await fetch(`/api/weather/current?city=${cityName}`);
        const data = await res.json();

        if (data.error) {
            alert("Could not find weather for " + cityName);
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error("Weather fetch failed:", error);
        alert("Failed to fetch weather data.");
    }
}

function displayWeather(data) {
    const resultDiv = document.getElementById("weatherResult");
    const nameEl = document.getElementById("cityName");
    const tempEl = document.getElementById("temp");
    const conditionEl = document.getElementById("condition");
    const windEl = document.getElementById("wind");
    const alertEl = document.getElementById("weatherAlert");

    if (!resultDiv) return;

    resultDiv.style.display = "block";
    nameEl.textContent = data.name + ", " + data.sys.country;
    tempEl.textContent = data.main.temp;
    conditionEl.textContent = data.weather[0].description;
    windEl.textContent = data.wind.speed;

    // Safety Alert Logic
    let alertMsg = "";
    let alertColor = "";

    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();

    if (temp > 35) {
        alertMsg = "⚠️ Extreme Heat Warning! Stay hydrated and avoid long sun exposure.";
        alertColor = "#fee2e2"; // light red
    } else if (temp < 5) {
        alertMsg = "⚠️ Cold Wave Alert! Wear warm clothing.";
        alertColor = "#e0f2fe"; // light blue
    }

    if (condition.includes("storm") || condition.includes("thunderstorm")) {
        alertMsg = "🚨 Severe Storm Warning! Stay indoors and avoid travel.";
        alertColor = "#fef3c7"; // light yellow/orange
    } else if (condition.includes("rain") && data.wind.speed > 10) {
        alertMsg = "⚠️ Heavy Rain & Wind! Be cautious while traveling.";
        alertColor = "#fef3c7";
    }

    if (alertMsg) {
        alertEl.textContent = alertMsg;
        alertEl.style.display = "block";
        alertEl.style.backgroundColor = alertColor;
        alertEl.style.color = "#991b1b"; // dark red for text
        alertEl.style.border = "1px solid #f87171";
    } else {
        alertEl.style.display = "none";
    }
}
