import Favorite from "../models/Favorite.js";

const getClientId = (req) => req.headers["x-client-id"] || req.query.clientId;

export const getFavorites = async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ message: "clientId required (header X-Client-Id)" });
  const list = await Favorite.find({ clientId }).sort({ addedAt: -1 }).lean();
  res.json(list.map(f => f.city));
};

export const addFavorite = async (req, res) => {
  const clientId = getClientId(req);
  const { city } = req.body;
  if (!clientId) return res.status(400).json({ message: "clientId required" });
  if (!city) return res.status(400).json({ message: "city required" });
  const exists = await Favorite.findOne({ clientId, city });
  if (!exists) await Favorite.create({ clientId, city });
  const list = await Favorite.find({ clientId }).sort({ addedAt: -1 }).lean();
  res.json(list.map(f => f.city));
};

export const removeFavorite = async (req, res) => {
  const clientId = getClientId(req);
  const city = req.params.city;
  if (!clientId) return res.status(400).json({ message: "clientId required" });
  if (!city) return res.status(400).json({ message: "city required in URL" });
  await Favorite.deleteMany({ clientId, city });
  const list = await Favorite.find({ clientId }).sort({ addedAt: -1 }).lean();
  res.json(list.map(f => f.city));
};
