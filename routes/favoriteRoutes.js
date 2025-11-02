import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:city", removeFavorite);

export default router;
