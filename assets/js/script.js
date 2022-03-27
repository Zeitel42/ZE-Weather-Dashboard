// calls to html elements
var header = document.querySelector(".header-title");
var searchBtn = document.querySelector("#searchBtn");
var userInput = document.querySelector("#userInput");
var previous = document.querySelector(".previous-searches");
var currentCity = document.querySelector(".current-city");
var currentIcon = document.querySelector("#currentIcon");
var cityName = document.querySelector("#name");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var uvi = document.querySelector("#uvi");
var fiveDayContainer = document.querySelector(".fiveDayContainer");

// global variables
var lat;
var lon;
var daily;
var search;
var previousBtnEl;
var preSearch;
var todayDate = new Date().toLocaleDateString('en-us', { year: "numeric", month: "numeric", day: "numeric" });
var today = todayDate;

// function to create elements
var createItem = function (element, className) {
    var newItem = document.createElement(element);
    newItem.setAttribute("class", className);
    return newItem;
}
// function call api to get lon lat coord
var getLonLat = function (event) {
    event.preventDefault();

    if (!userInput.value) {
        alert("please enter a city");
    }

    var userInputEl = userInput.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputEl + "&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                lon = data.coord.lon;
                lat = data.coord.lat;
                //  console.log(lat, lon);
                getWeather();
                previousSearches();
            })
        }
    })

};

// function call api to get info
var getWeather = function () {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly&appid=35d606b18114e6c6cd6fbbc187422a0a";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.daily);
                daily = data.daily;
                var icon = data.current.weather[0]["icon"];
                var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
                var iconAdd = currentIcon.setAttribute("src", iconUrl);

                cityName.innerHTML = userInput.value + " (" + today + ") ";
                temp.innerHTML = "Temp: " + Math.round(data.current.temp) + "\u00B0" + "F";
                wind.innerHTML = "Wind: " + Math.round(data.current.wind_speed) + "mph";
                humidity.innerHTML = "Humidity: " + Math.round(data.current.humidity) + "%";
                uvi.innerHTML = "UV Index: ";
                var uviCurrent = createItem("span", "uvi-current");
                uviCurrent.innerHTML = data.current.uvi;
                uvi.appendChild(uviCurrent);
                    if(data.current.uvi <= 2){
                        uviCurrent.className = "uvi-good";
                    }else if(data.current.uvi > 2 && data.current.uvi <= 5){
                        uviCurrent.className = "uvi-moderate";
                    }else if(data.current.uvi > 5 && data.current.uvi < 7){
                        uviCurrent.className = "uvi-high";
                    }else{
                        uviCurrent.className = "uvi-very-high";
                    }
                userInput.value = "";

                fiveDay();
            })
        }
    })
};

//function to display five day forecast
var fiveDay = function () {
    fiveDayContainer.innerHTML = "";
    // console.log(daily);
    for (var i = 1; i < 6; i++) {
        var forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString({ weekday: "long", year: "numeric", month: 'numeric' });
        var temp = "Temp: " + Math.round(daily[i].temp["max"]) + "\u00B0" + "F";
        var wind = "Wind: " + Math.round(daily[i].wind_speed) + "mph";
        var humidity = "Humidity: " + Math.round(daily[i].humidity) + "%";

        var icon = daily[i].weather[0]["icon"];
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

        // create elements
        var divEl = createItem("div", "col-xs divCard fiveDayClass");
        var dayDate = createItem("h5", "dayDate");
        dayDate.innerHTML = forecastDate;
        var iconImg = createItem("img", "iconImg");
        iconImg.setAttribute("src", iconUrl);
        iconImg.style.width = "20px";
        var ulListEl = createItem("ul", "ulList");
        ulListEl.style.listStyle = "none";
        ulListEl.style.paddingLeft = "0px";
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
}
//function to create buttons of previously searched cities from localStorage
var previousSearches = function () {

    var getSearches = JSON.parse(localStorage.getItem("searches")) || [];
    if(userInput.value != ""){
        getSearches.push(userInput.value);
    }
    var saveSearches = localStorage.setItem("searches", JSON.stringify(getSearches));
    previous.innerHTML = "";

    for (var i = 0; i < getSearches.length; i++) {

        previousBtnEl = createItem("button", "btn btn-secondary previousList");
        search = getSearches[i];
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputEl + "&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                lon = data.coord.lon;
                lat = data.coord.lat;
                //  console.log(lat, lon);
                getWeather();
            })
        }
    })
}

document.onload = previousSearches();

// getWeather();
// appid=35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getLonLat);
previous.addEventListener("click", searchHistory);
