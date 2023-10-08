
class WeatherUpdater {
    constructor() {
        //there's no problem to let the apiKey in the source code here as this is a project made to run completely on gitHub.
        //If i made a server-side code, it would be necessary to host it elsewhere.
        this.api_key = "&appid=904e5b67ea23911d0c37578b74aee2e0";
        this.api = "https://api.openweathermap.org/data/2.5/weather?";
        this.celsius = "&units=metric";
        this.currentDayInfo = {
            img: document.getElementById('currentDayInfo').querySelector('img'),
            temp: document.getElementById('info').querySelector('p'),

        }
        this.initializeCards();
        this.initializeImages();
    }
    initializeImages() {
        this.img = {brokenClouds: new Image(),
            almostRainCloud: new Image(),
            sun: new Image(),
            sunnyCloud: new Image(),
            lightRainCloud: new Image(),
            moderateRainCloud: new Image(),
            heavyRainCloud: new Image(),
            snow: new Image(),
        };
        this.img.brokenClouds.src = './images/icons/normal_cloud.png';
        this.img.almostRainCloud.src = './images/icons/rainyCloud.png';
        this.img.sun.src = './images/icons/sun.png';
        this.img.sunnyCloud.src = './images/icons/sunny_cloud.png';
        this.img.lightRainCloud.src = './images/icons/lightRainCloud.png';
        this.img.moderateRainCloud.src = './images/icons/moderateRainCloud.png';
        this.img.heavyRainCloud.src = './images/icons/heavyRainCloud.png';
        this.img.snow.src = './images/icons/snow.png'

    }
    initializeCards() {
        this.cards = document.querySelectorAll('.dayCard');
    }
    async updateAllWeather(city) {
        weatherUpdater.updateForeCast(city);
        weatherUpdater.updateCurrentDay(city); 
    }
    async updateForeCast(city) {
        const data = await this.fetchForeCast(city);
        const info = [];
        const today = timeUpdater.day;
        for (let i = today + 1; i < today + 6; i++) { //i = today + 1 because this functions has to get the data from the
            info.push(this.getTemp(data, i));         //days after today
            info[info.length-1].weather = this.getWeather(data, i);
        }
        this.cards.forEach((card, index)=>{
            const img = card.querySelector('img');
            const highTemp = card.querySelector('p').querySelector('.highestTemp');
            const lowTemp = card.querySelector('p').querySelector('.lowestTemp');
            lowTemp.innerHTML = `${parseInt(info[index].lowestTemp)}º`;
            highTemp.innerHTML = `${parseInt(info[index].highestTemp)}º`;
            this.updateImg({weather: [{description: info[index].weather}]}, img);
        })
    }
    async updateCurrentDay(city) {
        //updates the temperature and icon of todays weather
        const data = await this.fetchCurrentDayData(city);
        if (data) {
            this.currentDayInfo.temp.innerHTML = `${parseInt(data.main.temp)}º`
            this.updateImg(data, this.currentDayInfo.img);
        }
    }
    async fetchCurrentDayData(city) {
        const response = await fetch(this.api + `&q=${city}` + this.api_key + this.celsius);
        const data = await response.json();
        if (response.ok) {
            return data;
        }
        return null;
    }
    async fetchForeCast(city) {
        const response = await fetch(this.api + `&q=${city}` + this.api_key + this.celsius);
        const data = await response.json();
        if (data) {
            const lon = data.coord.lon;
            const lat = data.coord.lat;
            const call = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}${this.api_key}${this.celsius}`;
            const response2 = await fetch(call);
            const data2 = await response2.json();
            return data2;
        }
    }
    updateImg(data, imgElement) {
        const weatherDescription = data.weather[0].description;
        if (weatherDescription == 'broken clouds') {
            imgElement.src = this.img.brokenClouds.src;
        }
        else if (weatherDescription == 'overcast clouds' || weatherDescription == 'mist' || weatherDescription == 'fog') {
            imgElement.src = this.img.almostRainCloud.src;
        }
        else if (weatherDescription == 'clear sky') {
            imgElement.src = this.img.sun.src;
        }
        else if (weatherDescription == 'scattered clouds' || weatherDescription == 'few clouds') {
            imgElement.src = this.img.sunnyCloud.src;
        }
        else if (weatherDescription == 'light rain' || weatherDescription == 'drizzle') {
            imgElement.src = this.img.lightRainCloud.src;
        }
        else if (weatherDescription == 'moderate rain') {
            imgElement.src = this.img.moderateRainCloud.src;
        }
        else if (weatherDescription == 'heavy intensity rain' || weatherDescription == 'thunderstorm with light rain' ||
                weatherDescription == 'thunderstorm with heavy rain') {
            imgElement.src = this.img.heavyRainCloud.src;
        }
        else if (weatherDescription == 'light snow') {
            imgElement.src = this.img.snow.src;
        }
        else {
            console.log(weatherDescription);
        }
    }
    getWeather(data, day) {
        let weathers = [];
        for (let item of data.list) {
            const date = this.getDate(item);
            if (date.day == day) {
                weathers.push(item.weather[0].description);
            }
            else if (date.day > day) {
                break;
            }
        }
        return mostRecurrentString(weathers);
    }
    getTemp(data, day) {
        let tempsMax = [];
        let tempsMin = [];
        let averageTemp = 0;
        for (let item of data.list) {
            const date = this.getDate(item);
            if (date.day == day) {
                tempsMax.push(item.main.temp_max);
                tempsMin.push(item.main.temp_min);
            }
            else if (date.day > day) {
                break;
            }
        }
        for (let i = 0; i < tempsMax.length; i++) { //it does not make a difference to loop through tempsmin or tempsmax length, as they are the same size
            const avgTemp = (tempsMax[i] + tempsMin[i]) / 2;
            averageTemp += avgTemp;
        }
        return {
            avgTemp: averageTemp / tempsMax.length,
            highestTemp: Math.max(...tempsMax),
            lowestTemp: Math.min(...tempsMin),
        }
    }
    getDate(dataItem) {
        const dateAndTimeText = dataItem.dt_txt;
        const dateText = dateAndTimeText.split(' ')[0];
        const date = dateText.split('-');
        const year = date[0];
        const month = date[1];
        const day = date[2];
        return {day: parseInt(day), month: parseInt(month), year: parseInt(year)};
    }
    updateDaysInitials() {
        const date = new Date();
        const todayName = timeUpdater.getDayName(date);
        const nextDays = getNextDays(todayName, 5);
        this.cards.forEach((card, index)=>{
            const dayInitials = card.querySelector('h3');
            dayInitials.innerHTML = nextDays[index].slice(0, 3).toUpperCase();
        })
    }
}

function getNextDays(todayName, numberOfFutureDays) {
    //this function returns an array with the names of the (numberOfFutureDays) days ahead
    if (numberOfFutureDays > 7) {
        console.log('Only numbers <= 7 allowed!');
        return;
    }
    const daysOfWeek = timeUpdater.daysOfWeek;
    const todayIndex = daysOfWeek.indexOf(todayName);
    let nextDays = [];
   
    for (let i = 1; i <= numberOfFutureDays; i++) {
        const nextIndex = (todayIndex + i) % daysOfWeek.length;
        nextDays.push(daysOfWeek[nextIndex]);
    }
    return nextDays;
}

function mostRecurrentString(arr) {
    // Create an empty object to store the counts of each string.
    const stringCounts = {};
    // Iterate through the array and count occurrences of each string.
    arr.forEach((str) => {
        if (stringCounts[str]) {
            stringCounts[str]++;
        } else {
            stringCounts[str] = 1;
        }
    });
    // Find the string with the highest count.
    let mostRecurrent = null;
    let highestCount = 0;
    for (const str in stringCounts) {
        if (stringCounts[str] > highestCount) {
            highestCount = stringCounts[str];
            mostRecurrent = str;
        }
    }
    return mostRecurrent;
}

const weatherUpdater = new WeatherUpdater();
const city = 'sao paulo';
weatherUpdater.updateAllWeather(city);
weatherUpdater.updateDaysInitials();
