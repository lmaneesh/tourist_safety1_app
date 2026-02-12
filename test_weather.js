const axios = require("axios");
require("dotenv").config();

async function testWeather() {
    const city = "chennai";
    const apiKey = process.env.WEATHER_API_KEY;

    console.log("Testing API Key:", apiKey);

    if (!apiKey) {
        console.error("❌ No API key found in .env");
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        console.log("Request URL:", url);

        const response = await axios.get(url);
        console.log("✅ Success! Weather data:", response.data.weather[0]);
    } catch (error) {
        console.error("❌ API Call Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testWeather();
