const cache = new Map();

function cacheMiddleware(req, res, next) {
  const { city = '', days = '1' } = req.query;
  const key = `${city.toLowerCase()}-${days}`;

  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    const age = Date.now() - timestamp;

    if (age < 10 * 60 * 1000) { // Cache trong 10 phút
      return res.json(data);
    } else {
      cache.delete(key); // Hết hạn
    }
  }

  // Ghi đè res.json để lưu kết quả vào cache
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, { data, timestamp: Date.now() });
    return originalJson(data);
  };

  next();
}

module.exports = { cacheMiddleware };
