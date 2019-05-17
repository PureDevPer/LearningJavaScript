const weahter = document.querySelector(".js-weather");

const API_KEY = "85616b14bfc84b9641e418e55ab915b3";
const COORDS = 'coords';

let fahrenheit,
    isFahrenheit, 
    celsius,
    place;

// @argParam
// lat: latitude, lon: longitude
function getWeather(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`)
    .then(function(response){
        //console.log(response.json());
        return response.json()
    }).then(function(json){
        //console.log(json);
        fahrenheit = json.main.temp;
        isFahrenheit = true;
        const temperature = Math.round(fahrenheit);
        place = json.name;
        weahter.innerText = `${temperature} F / ${place}`;
    })
}

function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position){
    //console.log(position.coords.latitude);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        // Both are the same in JavaScript
        //latitude: latitude,
        latitude,
        //longitude: longitude
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGeoError(){
    console.log('Cant access geo location');
}

function askForCoords(){
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}


function loadCoords(){
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null){
        askForCoords();
    } else {
        // Get Weather
        const parseCoords = JSON.parse(loadedCoords);
        //console.log(parseCoords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

function changeUnit(){
    if(!isFahrenheit){
        isFahrenheit = true;
        weahter.innerText = `${Math.round(fahrenheit)} F / ${place}`;
        //console.log(fahrenheit, isFahrenheit);
    } else {
        celsius = (fahrenheit-32) * (5/9);
        isFahrenheit = false;
        weahter.innerText = `${Math.round(celsius)} C / ${place}`;
        //console.log(celsius, isFahrenheit);
    }

}

function init(){
    loadCoords();
    weahter.addEventListener("click", changeUnit);
}

init();