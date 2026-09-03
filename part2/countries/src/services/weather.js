import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const getWeather = (capital) => {
  const url = `https://api.openweathermap.org/data/2.5/weather` + `?q=${encodeURIComponent(capital)}` + `&appid=${apiKey}` + `&units=metric`;

  return axios.get(url);
};

export default {
  getWeather,
};
