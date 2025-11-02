import axios from "axios";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const OWM_KEY = "ba10666d12b71715e1266ef120a266c5";
const OPENWEATHER_API_KEY = "ba10666d12b71715e1266ef120a266c5";
if (!OWM_KEY) console.warn("OPENWEATHER_API_KEY not set in env");

const geoByCity = async (city) => {
  const q = encodeURIComponent(city);
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${OWM_KEY}`;
  const res = await axios.get(url);
  console.log(res.data);
  return res.data; // array of matches
};

export const geocode = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: "city required" });
  try {
    const results = await geoByCity(city);
    console.log(results.data);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "geocode failed" });
  }
};

export const currentWeather = async (req, res) => {
  try {
    let { city, lat, lon, units = "metric" } = req.query;
    if (city && !(lat && lon)) {
      const geo = await geoByCity(city);
      if (!geo || geo.length === 0) return res.status(404).json({ message: "city not found" });
      lat = geo[0].lat; lon = geo[0].lon;
    }
    if (!lat || !lon) return res.status(400).json({ message: "lat & lon or city required" });
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OWM_KEY}`;
    const r = await axios.get(url);
    console.log(r.data);
    res.json(r.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch current weather", error: err.response?.data || err.message });
  }
};


export const forecast = async (req, res) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    let latitude = lat;
    let longitude = lon;

    const apiKey = process.env.OPENWEATHER_API_KEY || "ba10666d12b71715e1266ef120a266c5";

    // 1️⃣ Get coordinates if only city is provided
    if (!latitude || !longitude) {
      if (!city) return res.status(400).json({ message: "City name or coordinates required" });

      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
      );

      if (!geoResponse.data.length) {
        return res.status(404).json({ message: "City not found" });
      }

      latitude = geoResponse.data[0].lat;
      longitude = geoResponse.data[0].lon;
    }

    // 2️⃣ Fetch 5-day / 3-hour forecast data
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`
    );

    // 3️⃣ Return forecast data directly (not nested)
    res.json(forecastResponse.data);
  } catch (error) {
    console.error("Error fetching forecast:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching forecast", error: error.message });
  }
};
