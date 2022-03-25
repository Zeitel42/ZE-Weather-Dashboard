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

var lat;
var lon;
var daily;
// var today = moment().format("l");
var todayDate = new Date().toLocaleDateString('en-us', {year:"numeric", month:"numeric", day:"numeric"});
var today = todayDate;

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
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon=" + lon + "&units=imperial&exclude=hourly&appid=35d606b18114e6c6cd6fbbc187422a0a";

    fetch(apiUrl).then(function(response){
       if(response.ok){
            response.json().then(function(data){
                // console.log(data.daily);
                daily = data.daily;
                var icon = data.current.weather[0]["icon"];
                var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
                var iconAdd = currentIcon.setAttribute("src", iconUrl);

                cityName.innerHTML = userInput.value + " (" + today +") ";
                temp.innerHTML = "Temp: " + Math.round(data.current.temp) + "\u00B0" + "F";
                wind.innerHTML = "Wind: " + Math.round(data.current.wind_speed) + "mph";
                humidity.innerHTML = "Humidity: " + Math.round(data.current.humidity) + "%";
                uvi.innerHTML = "UV index: " + data.current.uvi;
                userInput.value = "";

                fiveDay();
            })
        }  
    })
};

var createItem = function(element, className){
    var newItem = document.createElement(element);
    newItem.setAttribute("class", className);
    return newItem;
} 

var fiveDay = function(){
    console.log(daily);
    for(var i = 1; i < 6; i++){
        var forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString({weekday:"long", year:"numeric", month: 'numeric' });
        var temp = "Temp: " + Math.round(daily[i].temp["max"]) + "\u00B0" + "F";
        var wind = "Wind: " + Math.round(daily[i].wind_speed) + "mph";
        var humidity = "Humidity: " + Math.round(daily[i].humidity) + "%";

        var icon = daily[i].weather[0]["icon"];
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

    // create elements
        var divEl = createItem("div", "divCard card fiveDayClass");
        var dayDate = createItem("h5", "dayDate");
        dayDate.innerHTML = forecastDate;
        var iconImg = createItem("img", "iconImg");
        iconImg.setAttribute("src", iconUrl);
        iconImg.style.width = "20px";
        var ulListEl = createItem("ul", "ulList");
        ulListEl.style.listStyle = "none";
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


// getWeather();
// 35d606b18114e6c6cd6fbbc187422a0a
searchBtn.addEventListener("click", getLonLat);

