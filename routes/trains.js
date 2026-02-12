const express = require("express");
const axios = require("axios");
const router = express.Router();

const BASE_URL = "https://railradar.in/api";

// Get trains between two stations
router.get("/between", async (req, res) => {
    try {
        const { from, to, date } = req.query;

        const response = await axios.get(`${BASE_URL}/trainsBetweenStations`, {
            params: {
                from,
                to,
                date,
                apikey: process.env.RAILRADAR_KEY
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error("RailRadar error:", err.message);
        res.status(500).json({ error: "Train API failed" });
    }
});

// Live train running status
router.get("/status/:trainNo", async (req, res) => {
    try {
        const { trainNo } = req.params;

        const response = await axios.get(`${BASE_URL}/liveTrainStatus`, {
            params: {
                trainNo,
                apikey: process.env.RAILRADAR_KEY
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error("Status error:", err.message);
        res.status(500).json({ error: "Live status failed" });
    }
});

module.exports = router;
