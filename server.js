require("dotenv").config();
const express = require("express");
const app = express();
const locationRoutes = require("./routes/location");
const weatherRoutes = require("./routes/weatherRoutes");
const touristRoutes = require("./routes/touristRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const flightRoutes = require("./routes/flights");
const trainRoutes = require("./routes/trains");

app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// Routes
app.use("/api", locationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/tourist", touristRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/trains", trainRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
