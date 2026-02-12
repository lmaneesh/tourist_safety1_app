const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get flights departing from an airport (using IATA code)
router.get("/departures/:iata", async (req, res) => {
    try {
        const { iata } = req.params;

        // Aviationstack free tier often requires HTTP
        const response = await axios.get("http://api.aviationstack.com/v1/flights", {
            params: {
                access_key: process.env.AVIATIONSTACK_KEY,
                dep_iata: iata,
                limit: 10
            }
        });

        res.json(response.data.data || []);
    } catch (err) {
        console.error("Flight API error:", err.message);
        res.status(500).json({ error: "Flight API failed" });
    }
});

module.exports = router;
