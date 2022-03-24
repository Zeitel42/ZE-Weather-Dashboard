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

var lat;
var lon;
var today = moment().format("l");

var getLonLat = function(event){
    event.preventDefault();

    var userInputEl = userInput.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ userInputEl +"&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a"
    fetch(apiUrl).then(function(response){
        if(response.ok){
             response.json().then(function(data){
                 lon = data.coord.lon;
                 lat = data.coord.lat;
                //  console.log(lat, lon);
                getWeather();    
            })
        }
    })
};

var getWeather = function(){
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon=" + lon + "&units=imperial&exclude=hourly,daily&appid=35d606b18114e6c6cd6fbbc187422a0a";

    fetch(apiUrl).then(function(response){
       if(response.ok){
            response.json().then(function(data){
                console.log(data);
                var icon = data.current.weather[0]["icon"];
                var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
                var iconAdd = currentIcon.setAttribute("src", iconUrl);
                cityName.innerHTML = userInput.value + " (" + today +") ";
                temp.innerHTML = "Temp: " + Math.round(data.current.temp) + "\u00B0" + "F";
                wind.innerHTML = "Wind: " + Math.round(data.current.wind_speed) + "mph";
                humidity.innerHTML = "Humidity: " + Math.round(data.current.humidity) + "%";
                uvi.innerHTML = "UV index: " + data.current.uvi;
                userInput.value = "";
            })
        }
        
    })
};


// getWeather();
// 35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getLonLat);

var createItem = function(element, className){
    var newItem = document.createElement(element);
    newItem.setAttribute("class", className);
    return newItem;
} 