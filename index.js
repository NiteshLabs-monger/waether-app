//Api kay and url
// const APIKEY = "2cbd6de93ee49320d35c7952aa047809";

const search = document.getElementById("btn");
const body = document.getElementById("body");

const getWeatherbyCoords = async () => {
  const onLoadApi_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
  try {
    const [lat, lon] = await getCurrentLocation();
    const res = await fetch(onLoadApi_URL);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

function parseWeatherData(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp.toFixed(1) + "°C",
    feels_like: data.main.feels_like.toFixed(1) + "°C",
    temp_min: data.main.temp_min.toFixed(1) + "°C",
    temp_max: data.main.temp_max.toFixed(1) + "°C",
    humidity: data.main.humidity + "%",
    pressure: data.main.pressure + " hPa",
    visibility: (data.visibility / 1000).toFixed(1) + " km",
    wind_speed: data.wind.speed + "m/s",
    wind_dir: windDirection(data.wind.deg), // assumes you already wrote this helper
    cloudiness: data.clouds.all + "%",
    sunrise: formatTime(data.sys.sunrise, data.timezone), // assumes you have this helper
    sunset: formatTime(data.sys.sunset, data.timezone),
  };
}

// body.addEventListener('onload',()=>{
//   getWeatherbyCoords().then(
//     (data)=>{
//       const parseData = parseWeatherData(data);
//       embeddData(parseData);
//     }
//   )
// }

// )

// search.addEventListener("click", () => {
//   const cityName = document.getElementById("input1").value;
//   checkWeather(cityName).then(
//     (data) => {
//       const parsedata = parseWeatherData(data);
//       embeddData(parsedata);
//     });
// });

function SUN() {
  let raycount = 8;
  let suncontainer = document.getElementById("container2");
  for (let i = 0; i < raycount; i++) {
    let ray = document.createElement("div");
    ray.className = "rays";
    let angle = i * (360 / raycount);
    ray.style.zIndex = `${i}`;
    ray.style.transform = `rotate(${angle}deg) translate(170px)`;
    suncontainer.appendChild(ray);
  }
}

SUN();
function windDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// Convert Unix timestamp + timezone to IST (hh:mm AM/PM)
function formatTime(timestamp, timezone) {
  const local = new Date((timestamp + timezone) * 1000);
  return local.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

async function checkWeatherbyCityName(cityName) {
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`;

  try {
    const res = fetch(API_URL);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        resolve([lat, lon]); // return array [lat, lon]
      },
      (err) => {
        reject("Location not available: " + err.message);
      }
    );
  });
}

const embeddData = () => {
  const element = document.querySelectorAll(".embed");
};

function convertBandToAQI(aqi) {
  const map = {
    1: { min: 0, max: 50 },
    2: { min: 50, max: 100 },
    3: { min: 100, max: 150 },
    4: { min: 150, max: 200 },
    5: { min: 200, max: 300 },
  };
  let range = map.aqi;
  realAqi = (range.min + range.max) / 2;
  return realAqi;
}

const aqiValueEl = document.getElementById("aqi-value");
const value = convertBandToAQI(await AQI());
let currentValue = parseInt(aqiValueEl.textContent) || 0;
const duration = 1000;
const steps = 30;
const increment = (value - currentValue) / steps;
let step = 0;

const valueAnimation = setInterval(() => {
  step++;
  currentValue += increment;
  aqiValueEl.textContent = Math.round(currentValue);

  if (step >= steps) {
    clearInterval(valueAnimation);
    aqiValueEl.textContent = value;
  }
}, duration / steps);

async function AQI() {
  const [lat, lon] = await getCurrentLocation();
  const aqi_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKEY}`;

  const res = await fetch(aqi_URL);
  const data = await res.json();
  const aqi = data.list[0].main.aqi;
  return aqi;
}
