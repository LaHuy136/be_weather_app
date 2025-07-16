const {
  getCurrentWeather,
  getDailyWeather,
  getHourlyWeather
} = require('../services/weather.service');

async function current(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });

    const data = await getCurrentWeather(city);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function daily(req, res, next) {
  try {
    const { city, cnt } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });

    const count = Math.min(parseInt(cnt || 7), 16);
    const data = await getDailyWeather(city, count);
    res.json({ city, forecast: data });
  } catch (err) {
    next(err);
  }
}


async function hourly(req, res, next) {
  try {
    const { city, cnt } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });

    const count = Math.min(parseInt(cnt || 24), 48);
    const data = await getHourlyWeather(city, count);
    res.json({ city, forecast: data });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  current,
  daily,
  hourly
};
