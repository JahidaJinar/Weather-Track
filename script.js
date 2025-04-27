 const apiKey = "1bf041bf6e7b8428c0c77b88f552aa7e"; 

 const searchBtn = document.getElementById('search-btn');
 const cityInput = document.getElementById('city-input');
 const weatherCard = document.getElementById('weather-card');
 const forecastSection = document.getElementById('forecast-section');
 const themeToggle = document.getElementById('theme-toggle');
 const unitToggle = document.getElementById('unit-toggle');
 
 let currentTempC = 0;
 let currentTempF = 0;
 let forecastTempsC = [];
 let forecastTempsF = [];
 let isCelsius = true;
 
 searchBtn.addEventListener('click', () => {
   const city = cityInput.value.trim();
   if (city !== "") {
     getWeather(city);
   }
 });
 
 // Fetch Weather Data
 function getWeather(city) {
   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
     .then(res => res.json())
     .then(data => {
       displayWeather(data);
       getForecast(city);
       localStorage.setItem("lastCity", city);
     })
     .catch(() => alert('City not found.'));
 }
 
 // Display Current Weather
 function displayWeather(data) {
   document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
 
   currentTempC = data.main.temp;
   currentTempF = (currentTempC * 9/5) + 32;
 
   updateTemperature();
 
   document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
   document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
 
   // Display wind speed in km/h and m/s
   document.getElementById('wind').textContent = `Wind: ${data.wind.speed} km/h / ${convertWindSpeed(data.wind.speed)} m/s`;
   
   document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
 
   weatherCard.classList.remove('hidden');
 
   updateBackground(data.weather[0].main.toLowerCase());
 }
 
 // Convert wind speed from km/h to m/s
 function convertWindSpeed(kmh) {
   return (kmh / 3.6).toFixed(2); // Convert km/h to m/s
 }
 
 // Update Temperature Display
 function updateTemperature() {
   const tempElement = document.getElementById('temperature');
   tempElement.textContent = `Temperature: ${isCelsius ? Math.round(currentTempC) + '°C' : Math.round(currentTempF) + '°F'}`;
 }
 
 // Unit Toggle: Switch between Celsius and Fahrenheit
 unitToggle.addEventListener('click', () => {
   isCelsius = !isCelsius;
   updateTemperature();
   updateForecastTemperatures(); // Update forecast temperatures when unit is toggled
 });
 
 // Update Background Based on Weather Condition
 function updateBackground(condition) {
   document.body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy', 'clear', 'thunderstorm');
 
   if (condition.includes('cloud')) {
     document.body.classList.add('cloudy');
   } else if (condition.includes('rain')) {
     document.body.classList.add('rainy');
   } else if (condition.includes('snow')) {
     document.body.classList.add('snowy');
   } else if (condition.includes('clear')) {
     document.body.classList.add('clear');
   } else if (condition.includes('thunderstorm')) {
     document.body.classList.add('thunderstorm');
   } else {
     document.body.classList.add('sunny');
   }
 }
 
 // Fetch 5-Day Forecast
 function getForecast(city) {
   fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
     .then(res => res.json())
     .then(data => {
       displayForecast(data.list);
     });
 }
 
 // Display 5-Day Forecast
 function displayForecast(forecasts) {
   const forecastContainer = document.getElementById('forecast-cards');
   forecastContainer.innerHTML = "";
 
   // Only pick one forecast per day (e.g., at 12:00 PM)
   const filteredForecasts = forecasts.filter(f => f.dt_txt.includes("12:00:00"));
 
   // Reset forecast arrays for Celsius and Fahrenheit
   forecastTempsC = [];
   forecastTempsF = [];
 
   filteredForecasts.forEach(forecast => {
     const tempC = forecast.main.temp;
     const tempF = (tempC * 9/5) + 32;
 
     // Store temperatures for Celsius and Fahrenheit
     forecastTempsC.push(tempC);
     forecastTempsF.push(tempF);
 
     const card = document.createElement('div');
     card.classList.add('forecast-card');
 
     card.innerHTML = `
       <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
       <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Icon">
       <p>${Math.round(tempC)}°C</p>
       <p>${forecast.weather[0].description}</p>
     `;
 
     forecastContainer.appendChild(card);
   });
 
   forecastSection.classList.remove('hidden');
 }
 
 // Update 5-Day Forecast Temperatures Based on Unit
 function updateForecastTemperatures() {
   const forecastCards = document.querySelectorAll('.forecast-card');
 
   forecastCards.forEach((card, index) => {
     const tempElement = card.querySelector('p');
     const temp = isCelsius ? forecastTempsC[index] : forecastTempsF[index];
     tempElement.textContent = `${Math.round(temp)}°${isCelsius ? 'C' : 'F'}`;
   });
 }
 
 // Load Last City
 window.addEventListener('load', () => {
   const lastCity = localStorage.getItem("lastCity");
   if (lastCity) {
     getWeather(lastCity);
   }
 });
 

 

