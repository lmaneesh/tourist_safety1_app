require("dotenv").config();
const express = require("express");
const app = express();
const locationRoutes = require("./routes/location");
const weatherRoutes = require("./routes/weatherRoutes");
const touristRoutes = require("./routes/touristRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const flightRoutes = require("./routes/flights");
const trainRoutes = require("./routes/trains");

const path = require("path");

app.use(express.json());

// Serve static assets from public
app.use(express.static(path.join(__dirname, "public")));

// Route to serve HTML files from views
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  if (page.endsWith(".html")) {
    res.sendFile(path.join(__dirname, "views", page));
  } else {
    res.sendFile(path.join(__dirname, "views", `${page}.html`));
  }
});

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
