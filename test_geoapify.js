const axios = require("axios");

async function testGeoapify() {
    const city = "Ooty";
    console.log(`Testing Geoapify integration for: ${city}...`);

    try {
        const res = await axios.get(`http://localhost:3000/api/tourist/places?city=${city}`);
        console.log("✅ Tourist Places Success!");
        console.log("Samples:", res.data.slice(0, 2));

        const res2 = await axios.get(`http://localhost:3000/api/tourist/cottages?city=${city}`);
        console.log("✅ Cottages Success!");
        console.log("Samples:", res2.data.slice(0, 2));
    } catch (err) {
        console.error("❌ Test Failed:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testGeoapify();
