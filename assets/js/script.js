var header = document.querySelector(".header-title");
var searchBtn = document.querySelector("#searchBtn");
var userInput = document.querySelector("#userInput");
var previous = document.querySelector(".previous-searches");
var currentCity = document.querySelector(".current-city");
var cityName = document.querySelector("#name");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var uvi = document.querySelector("#uvi");


var createItem = function(element, className){
    var newItem = document.createElement(element);
    newItem.setAttribute("class", className);
    return newItem;
} 

var today = moment().format("l");

var getWeather = function(event){
    event.preventDefault();
    var userInputEl = userInput.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ userInputEl +"&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a";

    fetch(apiUrl).then(function(response){
       if(response.ok){
            response.json().then(function(data){
                
                console.log(data);
                cityName.innerHTML = data.name + " (" + today +")" + data.weather[0].icon;
                temp.innerHTML = "Temp: " + Math.round(data.main.temp) + "\u00B0" + "F";
                wind.innerHTML = "Wind: " + Math.round(data.wind.speed) + "mph";
                humidity.innerHTML = "Humidity: " + Math.round(data.main.humidity) + "%";
            })
        }
        
    })
};


// getWeather();
// 35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getWeather);