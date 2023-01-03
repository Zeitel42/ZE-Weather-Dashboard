// calls to html elements
var header = document.querySelector(".header-title");
var searchBtn = document.querySelector("#searchBtn");
var userInput = document.querySelector("#userInput");
var displayCity = document.querySelector(".display-city");
var previous = document.querySelector(".previous-searches");
var currentCity = document.querySelector(".city");
var currentIcon = document.querySelector("#currentIcon");
var cityName = document.querySelector("#name");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var uvi = document.querySelector("#uvi");
var fiveDayContainer = document.querySelector(".fiveDayContainer");
var fiveDayBlock = document.querySelector(".fiveDayBlock");

// global variables
var lat;
var lon;
var daily;
var search;
var previousBtnEl;
var preSearch;
var todayDate = new Date().toLocaleDateString("en-us");
console.log(todayDate);
var today = todayDate;

// function to create elements
var createItem = function (element, className) {
  var newItem = document.createElement(element);
  newItem.setAttribute("class", className);
  return newItem;
};
// function call api to get lon lat coord
var getLonLat = function (event) {
  event.preventDefault();

  if (!userInput.value) {
    alert("Please enter a city");
  }

  var userInputEl = userInput.value;
  if (!userInputEl) {
    userInputEl = "Raleigh";
  }
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userInputEl +
    "&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lon = data.coord.lon;
        lat = data.coord.lat;
        //  console.log(lat, lon);
        getWeather();
        previousSearches();
      });
    }
  });
};
//display current city card
currentCity.style.display = "none";
// function call api to get info
var getWeather = function (city) {
  currentCity.style.display = "block";

  if (!userInput.value) {
  }
  // city = "Raleigh";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=hourly&appid=35d606b18114e6c6cd6fbbc187422a0a";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // console.log(data.daily);
        daily = data.daily;
        var description = data.current.weather[0]["main"];
        var icon = data.current.weather[0]["icon"];
        var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
        var iconAdd = currentIcon.setAttribute("src", iconUrl);

        cityName.innerHTML = city || userInput.value + " (" + today + ") ";
        temp.innerHTML =
          "Temp: " + Math.round(data.current.temp) + "\u00B0" + "F";
        wind.innerHTML = "Wind: " + Math.round(data.current.wind_speed) + "mph";
        humidity.innerHTML =
          "Humidity: " + Math.round(data.current.humidity) + "%";
        uvi.innerHTML = "UV Index: ";
        var uviCurrent = createItem("span", "uvi-current");
        uviCurrent.innerHTML = data.current.uvi;
        uvi.appendChild(uviCurrent);
        //uvi for style
        if (data.current.uvi <= 2) {
          uviCurrent.className = "uvi-good";
        } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
          uviCurrent.className = "uvi-moderate";
        } else if (data.current.uvi > 5 && data.current.uvi < 7) {
          uviCurrent.className = "uvi-high";
        } else {
          uviCurrent.className = "uvi-very-high";
        }
        // current description for style
        if (description == "Clear") {
          currentCity.className = "city-clear";
        } else if (description == "Clouds") {
          currentCity.className = "city-clouds";
        } else if (description == "Drizzle") {
          currentCity.className = "city-drizzle";
        } else if (description == "Rain") {
          currentCity.className = "city-rain";
        } else if (description == "Snow") {
          currentCity.className = "city-snow";
        } else if (description == "Thunderstorm") {
          currentCity.className = "city-thunderstorm";
        } else {
          currentCity.className = "city-wind";
        }

        userInput.value = "";

        fiveDay();
      });
    }
  });
};
fiveDayBlock.style.display = "none";
//function to display five day forecast
var fiveDay = function () {
  fiveDayContainer.innerHTML = "";
  fiveDayBlock.style.display = "block";
  // console.log(daily);
  for (var i = 1; i < 6; i++) {
    var forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString({
      weekday: "long",
      year: "numeric",
      month: "numeric",
    });
    var temp = "Temp: " + Math.round(daily[i].temp["max"]) + "\u00B0" + "F";
    var wind = "Wind: " + Math.round(daily[i].wind_speed) + "mph";
    var humidity = "Humidity: " + Math.round(daily[i].humidity) + "%";

    var icon = daily[i].weather[0]["icon"];
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

    // create elements
    var divEl = createItem("div", "fiveDayClass");
    var dayDate = createItem("div", "dayDate");
    dayDate.innerHTML = forecastDate;
    var iconImg = createItem("img", "iconImg");
    iconImg.setAttribute("src", iconUrl);
    iconImg.style.width = "30%";
    var ulListEl = createItem("ul", "ulList");
    ulListEl.style.listStyle = "none";
    // ulListEl.style.paddingLeft = "0px";

    var listItemA = createItem("li", "listItem");
    listItemA.innerHTML = temp;
    var listItemB = createItem("li", "listItem");
    listItemB.innerHTML = wind;
    var listItemC = createItem("li", "listItem");
    listItemC.innerHTML = humidity;

    fiveDayContainer.appendChild(divEl);
    divEl.appendChild(dayDate);
    divEl.appendChild(iconImg);
    divEl.appendChild(ulListEl);

    ulListEl.append(listItemA, listItemB, listItemC);
  }
};

currentCity.style.display = "none";

//function to create buttons of previously searched cities from localStorage
var previousSearches = function () {
  currentCity.style.display = "block";

  var saveSearches = function () {
    localStorage.setItem("searches", JSON.stringify(getSearches));
  };

  var getSearches = JSON.parse(localStorage.getItem("searches")) || [];
  if (getSearches.length >= 4) {
    getSearches = getSearches.slice(0, 5);
  }
  let dataCheck = "";
  for (let i = 0; i < getSearches.length; i++) {
    dataCheck = getSearches[i];
    if (userInput.value === dataCheck) {
      return;
    }
  }
  if (userInput.value != "") {
    getSearches.unshift(userInput.value);
    saveSearches();
  }

  // saveSearches();
  previous.innerHTML = "";
  if (getSearches.length >= 4) {
    getSearches = getSearches.slice(0, 5);
  }
  for (var i = 0; i < getSearches.length; i++) {
    search = getSearches[i];

    previousBtnEl = createItem("button", "btn btn-secondary previousList");
    previousBtnEl.innerHTML = search;
    previousBtnEl.setAttribute("cityName", search);
    $(previous).append(previousBtnEl);
  }
};

//  function to get previous city search name and rerun
function searchHistory(e) {
  var button = e.target;
  preSearch = button.getAttribute("cityName");
  userInput.value = preSearch;

  // console.log(preSearch);

  var userInputEl = preSearch;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userInputEl +
    "&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lon = data.coord.lon;
        lat = data.coord.lat;
        //  console.log(lat, lon);
        getWeather();
      });
    }
  });
}

document.onload = previousSearches();

// getWeather();
// appid=35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getLonLat);
previous.addEventListener("click", searchHistory);
