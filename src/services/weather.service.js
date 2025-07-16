const axios = require('axios');
const unidecode = require('unidecode');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;

function toCelsius(kelvin) {
  return +(kelvin - 273.15).toFixed(1);
}

async function getCurrentWeather(city) {
  const cityName = unidecode(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`;

  const res = await axios.get(url);
  const data = res.data;

  return {
    temperature: toCelsius(data.main.temp),
    feels_like: toCelsius(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind_speed: data.wind.speed,
    temp_min: toCelsius(data.main.temp_min),
    temp_max: toCelsius(data.main.temp_max),
    rain: data.rain && typeof data.rain['1h'] === 'number' ? data.rain['1h'] : 0,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
  };
}

async function getDailyWeather(city) {
  const cityName = unidecode(city);
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${encodeURIComponent(cityName)}&cnt=16&appid=${API_KEY}`;

  const res = await axios.get(url);
  const forecastList = res.data.list;
  const timezoneOffset = res.data.city.timezone || 0;

  const now = new Date();
  const localNow = new Date(now.getTime() + timezoneOffset * 1000);

  const localDay = localNow.getUTCDay();
  const diffToMonday = (localDay + 6) % 7;
  const startOfWeek = new Date(localNow);
  startOfWeek.setUTCDate(localNow.getUTCDate() - diffToMonday);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

  const filtered = forecastList.filter(item => {
    const localDate = new Date((item.dt + timezoneOffset) * 1000);
    return localDate >= startOfWeek && localDate < endOfWeek;
  });

  return filtered.map(day => {
    const localDate = new Date((day.dt + timezoneOffset) * 1000);
    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: 'UTC'
    }).format(localDate);

    return {
      date: localDate.toISOString(),
      weekday,
      temperature: toCelsius(day.temp.day),
      description: day.weather[0].description,
      humidity: day.humidity
    };
  });
}




async function getHourlyWeather(city) {
  const cityName = unidecode(city);
  const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${encodeURIComponent(cityName)}&cnt=48&appid=${API_KEY}`;

  const res = await axios.get(url);
  const list = res.data.list;
  const timezoneOffset = res.data.city.timezone || 0;

  const now = new Date();
  const localNow = new Date(now.getTime() + timezoneOffset * 1000);
  const localToday = localNow.toISOString().split('T')[0];

  // Lọc các mốc thời gian cùng ngày địa phương
  const todayHours = list.filter(item => {
    const localTime = new Date((item.dt + timezoneOffset) * 1000);
    const localDate = localTime.toISOString().split('T')[0];
    return localDate === localToday;
  });

  return todayHours.map(hour => {
    const localTime = new Date((hour.dt + timezoneOffset) * 1000);
    const hourLabel = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(localTime);

    return {
      time: hourLabel,
      temperature: toCelsius(hour.main.temp),
      description: hour.weather[0].description,
      humidity: hour.main.humidity
    };
  });
}



module.exports = {
  getCurrentWeather,
  getDailyWeather,
  getHourlyWeather
};
