const apiKey = "e6e03379381427ba989fa95caeaca847";
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("city_input");
const currentTemp = document.getElementById("currentTemp");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIcon = document.getElementById("weatherIcon");
const currentDate = document.getElementById("currentDate");
const locationDisplay = document.getElementById("location");
const sunriseTime = document.getElementById("sunriseTime");
const sunsetTime = document.getElementById("sunsetTime");
const humidityVal = document.getElementById("humidityVal");
const pressureVal = document.getElementById("pressureVal");
const visibilityVal = document.getElementById("visibilityVal");
const windSpeedVal = document.getElementById("windSpeedVal");
const feelsVal = document.getElementById("feelsVal");
const aqiValue = document.getElementById("aqiValue");
const weatherAlert = document.getElementById("weatherAlert");
const forecastContainer = document.getElementById("five-day-forecast");
const hourlyForecastContainer = document.getElementById("hourly-forecast");
const monthlyForecastContainer = document.getElementById("monthly-forecast");
const historicalContainer = document.getElementById("historical-weather");
const newsContainer = document.getElementById("weather-news");
const unitToggle = document.getElementById("unit-toggle");

// Initialize Leaflet map
let map = L.map('map').setView([20, 78], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let currentMarker;

// Function to update the map
function updateMap(lat, lon, city, description, temp) {
    map.setView([lat, lon], 10);
    if (currentMarker) currentMarker.remove();
    currentMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${city}</b><br>Weather: ${description}<br>Temperature: ${temp}°C`)
        .openPopup();
}

// Updated function to dynamically change the background based on weather
function updateDynamicBackground(weatherMain) {
    const body = document.body;
    body.className = ''; // Reset any existing weather class

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            body.classList.add('weather-sunny');
            break;
        case 'clouds':
            body.classList.add('weather-cloudy');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('weather-rainy');
            break;
        case 'thunderstorm':
            body.classList.add('weather-thunderstorm');
            break;
        case 'snow':
            body.classList.add('weather-snowy');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            body.classList.add('weather-misty');
            break;
        default:
            body.classList.add('weather-default');
    }
}

// Fetch weather by city
async function fetchWeather(city) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("City not found.");
        const data = await response.json();
        updateWeatherUI(data);
        fetchForecast(data.name);
        fetchAQI(data.coord.lat, data.coord.lon);
        fetchHourlyForecast(data.coord.lat, data.coord.lon);
        fetchMonthlyForecast(data.name);
        updateMap(data.coord.lat, data.coord.lon, data.name, data.weather[0].description, Math.round(data.main.temp));
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Fetch AQI
async function fetchAQI(lat, lon) {
    try {
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(aqiUrl);
        const data = await response.json();
        aqiValue.textContent = `AQI: ${data.list[0].main.aqi}`;
    } catch (error) {
        console.error("Error fetching AQI data.");
    }
}

// Function to provide weather alerts
function provideWeatherAlert(description) {
    let alertMessage = "";
    description = description.toLowerCase();
    if (description.includes("rain")) {
        alertMessage = "It's rainy, take an umbrella.";
    } else if (description.includes("dust") || description.includes("sand")) {
        alertMessage = "It's too dusty, wear a mask.";
    } else if (description.includes("cold") || description.includes("snow")) {
        alertMessage = "It's too cold, wear a sweater.";
    } else if (description.includes("sunny") || description.includes("clear")) {
        alertMessage = "It's too sunny, wear sunscreen or take an umbrella.";
    } else if (description.includes("tsunami")) {
        alertMessage = "Tsunami warning, be cautious.";
    } else if (description.includes("storm")) {
        alertMessage = "Storm warning, stay indoors.";
    } else if (description.includes("fog")) {
        alertMessage = "It's foggy, drive carefully.";
    } else if (description.includes("hail")) {
        alertMessage = "Hailstorm expected, stay indoors.";
    } else if (description.includes("thunderstorm")) {
        alertMessage = "Thunderstorm warning, avoid open areas.";
    } else if (description.includes("tornado")) {
        alertMessage = "Tornado warning, seek shelter immediately.";
    } else if (description.includes("hurricane")) {
        alertMessage = "Hurricane warning, evacuate if advised.";
    } else if (description.includes("drizzle")) {
        alertMessage = "Light drizzle, carry a light jacket.";
    } else if (description.includes("hot")) {
        alertMessage = "It's very hot, stay hydrated.";
    } else if (description.includes("humid")) {
        alertMessage = "High humidity, stay cool and hydrated.";
    } else if (description.includes("blizzard")) {
        alertMessage = "Blizzard warning, stay indoors and keep warm.";
    } else if (description.includes("flood")) {
        alertMessage = "Flood warning, move to higher ground.";
    } else if (description.includes("sleet")) {
        alertMessage = "Sleet expected, roads may be slippery.";
    } else if (description.includes("freezing rain")) {
        alertMessage = "Freezing rain expected, be cautious of ice.";
    } else if (description.includes("smoke")) {
        alertMessage = "Smoke in the air, wear a mask if going outside.";
    } else if (description.includes("volcanic ash")) {
        alertMessage = "Volcanic ash in the air, stay indoors.";
    } else if (description.includes("avalanche")) {
        alertMessage = "Avalanche warning, avoid mountainous areas.";
    } else if (description.includes("heatwave")) {
        alertMessage = "Heatwave expected, stay indoors and stay hydrated.";
    } else if (description.includes("cold wave")) {
        alertMessage = "Cold wave expected, stay warm and indoors.";
    } else if (description.includes("gale")) {
        alertMessage = "Gale warning, avoid coastal areas.";
    } else if (description.includes("cyclone")) {
        alertMessage = "Cyclone warning, evacuate if advised.";
    } else if (description.includes("lightning")) {
        alertMessage = "Lightning warning, stay indoors and avoid open areas.";
    } else {
        alertMessage = "Weather looks good, have a nice day!";
    }

    // Update UI alert
    weatherAlert.textContent = alertMessage;

    // Show notification
    showNotification(alertMessage);
}

function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Weather Alert", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Weather Alert", { body: message });
            }
        });
    }
}

// Update UI
function updateWeatherUI(data) {
    locationDisplay.textContent = `${data.name}, ${data.sys.country}`;
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentDate.textContent = new Date().toDateString();
    sunriseTime.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunsetTime.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    humidityVal.textContent = `Humidity: ${data.main.humidity}%`;
    pressureVal.textContent = `Pressure: ${data.main.pressure} hPa`;
    visibilityVal.textContent = `Visibility: ${(data.visibility / 1000).toFixed(1)} km`;
    windSpeedVal.textContent = `Wind: ${data.wind.speed} m/s`;
    feelsVal.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
    // Provide weather alert
    provideWeatherAlert(data.weather[0].description);
    // Update dynamic background
    updateDynamicBackground(data.weather[0].main);
}

// Fetch weather by current location
async function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            await getWeatherDetails(position.coords.latitude, position.coords.longitude);
        }, () => alert("Geolocation permission denied."));
    } else {
        alert("Geolocation is not supported.");
    }
}

// Fetch weather using coordinates
async function getWeatherDetails(lat, lon) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();
        updateWeatherUI(data);
        fetchForecast(data.name);
        fetchAQI(lat, lon);
        fetchHourlyForecast(lat, lon);
        fetchMonthlyForecast(data.name);
        updateMap(lat, lon, data.name, data.weather[0].description, Math.round(data.main.temp));
    } catch (error) {
        alert("Error fetching location data.");
    }
}

// Fetch 5-day forecast data
async function fetchForecast(city) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(forecastUrl);
        const data = await response.json();
        updateForecastUI(data.list);
    } catch (error) {
        console.error("Error fetching forecast data.");
    }
}

// Update 5-day forecast UI
function updateForecastUI(forecastData) {
    forecastContainer.innerHTML = "";
    forecastData.filter((_, index) => index % 8 === 0).forEach(forecast => {
        const item = document.createElement("div");
        item.innerHTML = 
            `<p>${forecast.dt_txt.split(" ")[0]}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
            <p>${Math.round(forecast.main.temp)}°C</p>`;
        forecastContainer.appendChild(item);
    });
}

// Fetch Hourly Forecast (Next 24 Hours)
async function fetchHourlyForecast(lat, lon) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(forecastUrl);
        const data = await response.json();
        updateHourlyForecastUI(data.list.slice(0, 8)); // Next 24 hours (3-hour intervals)
    } catch (error) {
        console.error("Error fetching hourly forecast data.");
    }
}

// Update Hourly Forecast UI
function updateHourlyForecastUI(hourlyData) {
    hourlyForecastContainer.innerHTML = hourlyData.map(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `<div class="hour">
                    <p>${time}</p>
                    <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="${hour.weather[0].description}">
                    <p>${Math.round(hour.main.temp)}°C</p>
                </div>`;
    }).join('');
}

// Fetch Monthly Forecast
async function fetchMonthlyForecast(city) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=30&appid=${apiKey}&units=metric`;
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error("Failed to fetch monthly forecast");
        const data = await response.json();
        updateMonthlyForecastUI(data.list);
    } catch (error) {
        console.error("Error fetching monthly forecast data:", error);
    }
}

// Update Monthly Forecast UI
function updateMonthlyForecastUI(forecastData) {
    monthlyForecastContainer.innerHTML = "";
    const daysInMonth = 30; // Assuming 30 days for simplicity
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "day empty";
        monthlyForecastContainer.appendChild(emptyCell);
    }

    // Create cells for each day in the month
    forecastData.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const temp = Math.round(forecast.main.temp);
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        const day = document.createElement("div");
        day.className = "day";
        day.innerHTML = `<p>${date}</p><img src="${icon}" alt="weather-icon"><p>${temp}°C</p>`;
        monthlyForecastContainer.appendChild(day);
    });
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

locationBtn.addEventListener("click", fetchWeatherByLocation);

// Fixed unterminated string literal
function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    // ...existing code...
}