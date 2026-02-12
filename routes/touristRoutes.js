const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get famous tourist places using Geoapify
router.get("/places", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        // 1. Get coordinates for the city using OpenCage (already in project)
        const geocodeRes = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
            params: {
                q: city,
                key: process.env.OPENCAGE_API_KEY,
                limit: 1
            }
        });

        if (!geocodeRes.data.results.length) {
            return res.status(404).json({ error: "City not found" });
        }

        const { lat, lng: lon } = geocodeRes.data.results[0].geometry;

        // 2. Fetch places from Geoapify
        const geoapifyRes = await axios.get("https://api.geoapify.com/v2/places", {
            params: {
                categories: "tourism.attraction,tourism.sights",
                filter: `circle:${lon},${lat},5000`,
                bias: `proximity:${lon},${lat}`,
                limit: 20,
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        });

        const places = geoapifyRes.data.features.map(f => ({
            name: f.properties.name || "Unnamed Attraction",
            rating: "N/A", // Geoapify doesn't provide ratings in basic places query
            address: f.properties.formatted || "Address not available",
            categories: f.properties.categories ? f.properties.categories.join(", ") : "Tourist Sight"
        }));

        res.json(places);
    } catch (err) {
        console.error("Geoapify fetch failed:", err.message);
        res.status(500).json({ error: "Places fetch failed" });
    }
});

// Get budget cottages/hotels (using Geoapify)
router.get("/cottages", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        // 1. Geocode
        const geocodeRes = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
            params: { q: city, key: process.env.OPENCAGE_API_KEY, limit: 1 }
        });
        if (!geocodeRes.data.results.length) return res.status(404).json({ error: "City not found" });
        const { lat, lng: lon } = geocodeRes.data.results[0].geometry;

        // 2. Fetch Accommodations from Geoapify
        const geoapifyRes = await axios.get("https://api.geoapify.com/v2/places", {
            params: {
                categories: "accommodation.hotel,accommodation.hostel,accommodation.apartment",
                filter: `circle:${lon},${lat},5000`,
                bias: `proximity:${lon},${lat}`,
                limit: 10,
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        });

        const cottages = geoapifyRes.data.features.map(f => ({
            name: f.properties.name || "Unnamed Stay",
            address: f.properties.formatted || "Address not available",
            price: "Check Website"
        }));

        res.json(cottages);
    } catch (err) {
        console.error("Geoapify cottages fetch failed:", err.message);
        res.status(500).json({ error: "Cottages fetch failed" });
    }
});

module.exports = router;
