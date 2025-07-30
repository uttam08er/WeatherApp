const citySearch = document.querySelector(".weather_search");
const searchIcon = document.querySelector(".fa-magnifying-glass");

const loadingMsg = document.querySelector(".loading_msg");
const weatherBody = document.querySelector(".weather_body");
const cityName = document.querySelector(".weather_city");
const dateTime = document.querySelector(".weather_date_time");
const w_forecast = document.querySelector(".weather_forecast");
const w_icon = document.querySelector(".weather_icon");
const w_temperature = document.querySelector(".weather_temperature");
const w_minTem = document.querySelector(".weather_min");
const w_maxTem = document.querySelector(".weather_max");

const w_feelsLike = document.querySelector(".weather_feelsLike");
const w_humidity = document.querySelector(".weather_humidity");
const w_wind = document.querySelector(".weather_wind");
const w_pressure = document.querySelector(".weather_pressure");

const API_KEY = '7ac31eec30f29d9863e5ba0ce854b006';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

let city = "";


// to get the actual country name
const getCountryName = (code) => {
  return new Intl.DisplayNames([code], { type: "region" }).of(code);
};

// to get the date and time
const getDateTime = (dt) => {
  const curDate = new Date(dt * 1000); // Convert seconds to milliseconds
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(curDate);
};


// Show loading state
function showLoading() {
  loadingMsg.textContent = "Loading...";
  weatherBody.style.display = 'none';
  loadingMsg.style.display = 'block';
}

// Hide loading state
function hideLoading() {
  weatherBody.style.display = 'block';
  loadingMsg.style.display = 'none';
}

// Show error message
function showError(message) {
  loadingMsg.textContent = message;
  loadingMsg.style.display = 'block';
  weatherBody.style.display = 'none';
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
  const url = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    await getWeatherData(url);
  } catch (err) {
    showError(err.message);
  }
}

// Get weather by city name
async function getWeatherByCity(city) {
  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    await getWeatherData(url);
  } catch (err) {
    showError(err.message);
  }
}

// search functionality
searchIcon.addEventListener("click", () => {
  showLoading();
  let cityName = document.querySelector(".city_name");
  console.log(cityName.value);
  city = cityName.value;
  getWeatherByCity(city);
  cityName.value = "";
});

citySearch.addEventListener("submit", (e) => {
  e.preventDefault();
  searchIcon.click();
});


const getWeatherData = async (url) => {
  const weatherUrl = `${url}`;
  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    if (!res.ok) {
      showError(data.message);
    }
    console.log(data);

    const { main, name, weather, wind, sys, dt } = data;

    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerHTML = getDateTime(dt);

    w_forecast.innerHTML = weather[0].main;
    w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;

    w_temperature.innerHTML = `${main.temp}&#176 C`;
    w_minTem.innerHTML = `Min: ${main.temp_min.toFixed()}&#176`;
    w_maxTem.innerHTML = `Min: ${main.temp_max.toFixed()}&#176`;

    w_feelsLike.innerHTML = `${main.feels_like.toFixed(2)}&#176 C`;
    w_humidity.innerHTML = `${main.humidity} %`;
    w_wind.innerHTML = `${wind.speed} m/s`;
    w_pressure.innerHTML = `${main.pressure} hPa`;
    hideLoading();
  } catch (error) {
    console.log(error);
  }
};



// Get user's current location
const getCurrentLocation = async () => {
  showLoading();
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by this browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    // Success callback
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    },

    // Error callback
    function (error) {
      let errorMessage = "";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location access denied by user.\n Please try searching weather using city name. ';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out.';
          break;
        default:
          errorMessage += 'An unknown error occurred.';
          break;
      }
      showError(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  );
}

document.body.addEventListener("load", getCurrentLocation());
