const express = require("express");
const router = express.Router();

// Trigger SOS
router.post("/sos", async (req, res) => {
    const { userId, userName, location, city } = req.body;

    if (!userId) return res.status(400).json({ error: "User info required" });

    console.log(`🚨 SOS TRIGGERED! 🚨`);
    console.log(`User: ${userName} (${userId})`);
    console.log(`City: ${city}`);
    console.log(`Coordinates: Lat ${location.lat}, Lon ${location.lon}`);
    console.log(`Alerting Police and Rescue Teams...`);

    // In a real app, this would send SMS/Email/Push or call an emergency API
    res.json({
        success: true,
        message: "SOS Alert sent to authorities! Help is on the way."
    });
});

module.exports = router;
