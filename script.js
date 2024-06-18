const cityinput = document.querySelector("#city-Input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".current-loc-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");
const weatherDataDiv = document.querySelector(".weather-data");
const API_KEY = "6873fd4c9bc11d632088ddb67998a454";

const createWeatherCard = (cityName, weatheritem, index) => {
    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} (${weatheritem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${(weatheritem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatheritem.wind.speed} m/s</h4>
                <h4>Humidity: ${weatheritem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@2x.png">
                <h4>${weatheritem.weather[0].description}</h4>
            </div>`;
    } else {
        return `
            <li class="card">
                <h3>${weatheritem.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@2x.png">
                <h4>Temperature: ${(weatheritem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatheritem.wind.speed} m/s</h4>
                <h4>Humidity: ${weatheritem.main.humidity}%</h4>
            </li>`;
    }
};

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(weatherAPI)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysData = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            cityinput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardDiv.innerHTML = "";

            fiveDaysData.forEach((weatheritem, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatheritem, index));
                } else {
                    weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatheritem, index));
                }
            });

            weatherDataDiv.style.display = "block";
        })
        .catch(() => {
            alert("An error occurred while fetching weather forecast");
        });
};

const getCityCoordinates = () => {
    const cityName = cityinput.value.trim();
    if (!cityName) return;
    const geolocationAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
    fetch(geolocationAPI)
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                return alert("City not found");
            }
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates");
        });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=&appid=${API_KEY}`
            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    if (!data.length) {
                        return alert(`No coordinates found for ${cityName}`);
                    }
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.")
            }
        }

    )
}

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);


