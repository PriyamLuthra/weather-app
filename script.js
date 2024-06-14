const cityinput = document.querySelector("#city-Input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");
const API_KEY = "6873fd4c9bc11d632088ddb67998a454";

const createWeatherCard = (cityName ,  weatheritem , index) => {
    if (index === 0) {
        return `<div class="details">
                  <h2>${cityName} (${weatheritem.dt_txt.split(" ")[0]})</h2>
                  <h4>Tempeature: ${(weatheritem.main.temp - 273.15).toFixed(2)}</h4>
                  <h4>Wind: ${weatheritem.wind.speed} M/S</h4>
                  <h4>Humidity: ${weatheritem.main.humidity}%</h4>
              </div>
              <div class="icon">
                 <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@2x.png">
                  <h4>${weatheritem.weather[0].description}</h4>
              </div>`
        
    } else {     
        return `<li class="card">
                   <h3>(${weatheritem.dt_txt.split(" ")[0]})</h3>
                   <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@2x.png">
                   <h4>Tempeature: ${(weatheritem.main.temp - 273.15).toFixed(2)}</h4>
                   <h4>Wind: ${weatheritem.wind.speed} M/S</h4>
                   <h4>Humidity: ${weatheritem.main.humidity}%</h4>
                </li>`
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(weatherAPI).then(res => res.json()).then(data => {

        const uniqueForcastDays = [];

        const fiveDaysData = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForcastDays.includes(forecastDate)) {
                return uniqueForcastDays.push(forecastDate);
            }
        });

        cityinput.value = "";
        currentWeatherDiv.innerHTML = " ";
        weatherCardDiv.innerHTML = "";

        fiveDaysData.forEach((weatheritem , index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName , weatheritem ,index));
            }else{
                weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName , weatheritem , index));
            }
        });

    }).catch(() => { alert("An error occured while fetching weather forecast") });
}

const getCityCordinates = () => {
    const cityName = cityinput.value.trim();
    if (!cityName) return;
    const geolocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    fetch(geolocation).then(res => res.json()).then(data => {
        if (!data.length) return alert("tatti khaa");
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates")
    })
}
searchButton.addEventListener("click", getCityCordinates);

