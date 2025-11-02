import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();
await connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => res.send("Weather API"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
