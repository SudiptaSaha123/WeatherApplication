const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");


let oldTab = userTab;

// const API_KEY = "PUT THE API KEY HERE";

oldTab.classList.add("current-tab");

getfromSessionStorage();

function switchTab(newTab) {

    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {

            //IS SEARCH FORM CONTAINER IS INVISIBLE ? IF YES THEN MAKE IT VISIBLE
            
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        
        }
        else {
        
            //PREVIOUSLY THE USER WAS IN SEARCH TAB, NOW MAKE VISIBLE USER TAB
        
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // NOW USER IS IN USER TAB SO WE NEED TO SHOW THE WEATHER ALSO, SO LET'S CHECK THE LOCAL STORAGE FIRST FOR CORDINATES IF THEY ARE SAVED
            
            getfromSessionStorage();
        
        }
    }
}

userTab.addEventListener("click", () => {

    //PASS CLICKED TAB AS INPUT PARAMETER
    
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {

    //PASS CLICKED TAB AS INPUT PARAMETER

    switchTab(searchTab);
});

//CHECK IF COORDINATES ARE ALREADY PRESENT IN SESSION STORAGE

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {

        //IF LOCAL COORDINATES ARE NOT FOUND
        
        grantAccessContainer.classList.add("active");
    
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    //MAKE GRANTACCESS CONTAINER INVISIBLE

    grantAccessContainer.classList.remove("active");

    //MAKE LOADER VISIBLE

    loadingScreen.classList.add("active");

    //API CALL

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
    }

}

function renderWeatherInfo(weatherInfo) {

    //WE HAVE TO FETCH THE ELEMENTS

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //FETCH VALUES FROM WEATHERINFO OBJECT AND PUT IT UI ELEMENTS

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
    }
}