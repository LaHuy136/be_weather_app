const express = require('express');
const weatherRoutes = require('./src/routes/weather.route');
const { errorHandler } = require('./src/middlewares/errorHandler.middleware');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/weather', weatherRoutes);
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
