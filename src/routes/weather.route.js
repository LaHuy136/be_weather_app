const express = require('express');
const {
  current,
  daily,
  hourly
} = require('../controllers/weather.controller');
const { cacheMiddleware } = require('../middlewares/cache.middleware');

const router = express.Router();

router.get('/current', current);
router.get('/daily', daily);
router.get('/hourly', hourly);

module.exports = router;
