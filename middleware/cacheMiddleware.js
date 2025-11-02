import NodeCache from "node-cache";
const cache = new NodeCache();

const cacheMiddleware = (ttlSeconds = 60) => (req, res, next) => {
  const key = `${req.method}:${req.originalUrl}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    // Only cache successful GET responses
    if (req.method === "GET") cache.set(key, data, ttlSeconds);
    originalJson(data);
  };
  next();
};

export { cache, cacheMiddleware };
export default cacheMiddleware;
