const express = require("express");
const axios = require("axios");
const router = express.Router();

/* 🔍 SEARCH CITY (Forward Geocoding) */
router.get("/locations", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) return res.json({ results: [] });

        // Fallback if no key provided (for testing/demo purposes or if user hasn't set it yet)
        if (!process.env.OPENCAGE_API_KEY || process.env.OPENCAGE_API_KEY === 'your_api_key_here') {
            console.warn("OPENCAGE_API_KEY is missing. Returning mock data.");
            // Simple mock to prevent crash if key is missing
            return res.json({ results: [{ name: q }] });
        }

        const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
                params: {
                    q,
                    key: process.env.OPENCAGE_API_KEY,
                    countrycode: "in",
                    limit: 5,
                    no_annotations: 1
                }
            }
        );

        const results = response.data.results.map(item => ({
            name:
                item.components.city ||
                item.components.town ||
                item.components.state_district ||
                item.formatted
        }));

        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Location search failed" });
    }
});

/* 📍 REVERSE GEOCODE */
router.get("/reverse-geocode", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // Fallback if no key provided
        if (!process.env.OPENCAGE_API_KEY || process.env.OPENCAGE_API_KEY === 'your_api_key_here') {
            console.warn("OPENCAGE_API_KEY is missing. Returning mock data.");
            return res.json({ city: "Chennai" }); // Default
        }

        const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
                params: {
                    q: `${lat},${lon}`,
                    key: process.env.OPENCAGE_API_KEY,
                    limit: 1,
                    no_annotations: 1
                }
            }
        );

        const comp = response.data.results[0].components;

        const city =
            comp.city ||
            comp.town ||
            comp.village ||
            comp.state_district;

        res.json({ city });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Reverse geocoding failed" });
    }
});

module.exports = router;
