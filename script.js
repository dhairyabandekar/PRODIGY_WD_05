const apiKey = "aed347eec635a7dfb8a4606f9c348383"; // your OpenWeatherMap API key

// Get weather by city name
async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeatherData(url);
}

// Get weather by user’s current location
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        fetchWeatherData(url);
      },
      () => {
        alert("Location access denied. Please enter a city manually.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Fetch and display weather data
async function fetchWeatherData(url) {
  try {
    console.log("Fetching:", url);

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.cod != 200) {
      throw new Error(data.message);
    }

    displayWeather(data);
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
  }
}

// Display weather info
function displayWeather(data) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const condition = data.weather[0].main.toLowerCase();

  // Change background dynamically
  setBackground(condition);

  const weatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Weather Icon">
    <p>🌡️ Temperature: ${data.main.temp} °C</p>
    <p>☁️ Condition: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
  `;

  document.getElementById("weatherResult").innerHTML = weatherHTML;
}

// Function to set background dynamically
function setBackground(condition) {
  let gradient;

  if (condition.includes("clear")) {
    gradient = "linear-gradient(135deg, #f9d423, #ff4e50)"; // sunny
  } else if (condition.includes("cloud")) {
    gradient = "linear-gradient(135deg, #d7d2cc, #304352)"; // cloudy
  } else if (condition.includes("rain")) {
    gradient = "linear-gradient(135deg, #4facfe, #00f2fe)"; // rainy
  } else if (condition.includes("thunderstorm")) {
    gradient = "linear-gradient(135deg, #141e30, #243b55)"; // storm
  } else if (condition.includes("snow")) {
    gradient = "linear-gradient(135deg, #e6dada, #274046)"; // snowy
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    gradient = "linear-gradient(135deg, #3e5151, #decba4)"; // foggy
  } else {
    gradient = "linear-gradient(135deg, #74ebd5, #9face6)"; // default
  }

  document.body.style.background = gradient;
}
