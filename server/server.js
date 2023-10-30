const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    ); // Example mock data from JSONPlaceholder
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
app.get("/api/search", async (req, res) => {
  const { symbol, period } = req.query;
  // Fetch and return mock data based on the symbol and period
  const data = generateMockData(symbol, period);
  console.log(data,'data');
  res.json(data);
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function generateMockData(symbol, period) {
  const data = [];
  const now = Date.now();
  let time = now;

  for (let i = 0; i < 100; i++) {
    const date = new Date(time);
    const open = getRandomArbitrary(100, 200);
    const high = getRandomArbitrary(open, open + 10);
    const low = getRandomArbitrary(open - 10, open);
    const close = getRandomArbitrary(low, high);
    const volume = getRandomArbitrary(1000, 5000);

    data.push({
      time: date,
      open,
      high,
      low,
      close,
      volume,
    });

    if (period === "hourly") {
      time -= 60 * 60 * 1000; // One hour
    } else {
      time -= 24 * 60 * 60 * 1000; // One day
    }
  }

  return data.reverse();
}
app.listen(port, () => {
  console.log(`Express.js server is running on http://localhost:${port}`);
});
