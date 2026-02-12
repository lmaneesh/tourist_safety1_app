const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/current", async (req, res) => {
    const { city } = req.query;

    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: city,
                    units: "metric",
                    appid: process.env.WEATHER_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error("Weather fetch failed:", err.message);
        res.status(500).json({ error: "Weather fetch failed" });
    }
});

module.exports = router;
