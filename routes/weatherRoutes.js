import express from "express";
import { geocode, currentWeather, forecast } from "../controllers/weatherController.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.get("/geocode", cacheMiddleware(30), geocode);
router.get("/current", cacheMiddleware(30), currentWeather);
router.get("/forecast", cacheMiddleware(30), forecast);

export default router;
