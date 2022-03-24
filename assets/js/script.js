var header = document.querySelector(".header-title");
var searchBtn = document.querySelector("#searchBtn");
var userInput = document.querySelector("#userInput");
var previous = document.querySelector(".previous-searches");
var currentCity = document.querySelector(".current-city");
var newData;

var getWeather = function(event){
    event.preventDefault();
    var userInputEl = userInput.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ userInputEl +"&units=imperial&APPID=35d606b18114e6c6cd6fbbc187422a0a";

    fetch(apiUrl).then(function(response){
       if(response.ok){
            response.json().then(function(data){
                console.log(data);
                
            })
        }
        
    })
};
// getWeather();
// 35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getWeather);