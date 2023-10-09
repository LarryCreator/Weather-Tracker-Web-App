const BASE_URL = 'https://countriesnow.space/api/v0.1/countries'

async function getPlacesNames(country) {
  const response = await fetch(`${BASE_URL}`).then(response => response.json())
  const { data } = response
  const countryName = data.find(obj=> obj.iso2 == country).country;
  return countryName;
}


class PlaceSearcher {
    constructor() {
        this.cityCountry = document.querySelector('#cityCountry');
        this.countryElement = this.cityCountry.querySelector('p');
        this.placeElement = document.querySelector('#cityCountry h1');
        this.currentPlace = this.placeElement.innerHTML;
    }

    async updatePlaceAndCountry(place, placeElement, countryElement) {
        const data = await weatherUpdater.fetchCurrentDayData(place);
        if (data) {
            turnToLoadingMode();
            this.currentPlace = data.name;
            placeElement.innerHTML = `${this.currentPlace} `;
            const countryName = await getPlacesNames(data.sys.country);
            countryElement.innerHTML = data.sys.country == null ? '' : countryName == this.currentPlace ? '' : countryName;
            return true;
        }
        else {
            window.alert(`Could not find ${place}`);
            return false;
        }
    }
    async search(place) {
        if (place) {
            const placeAndCountry = await weatherUpdater.updateAllWeather(place);
            return placeAndCountry
        }
    }
}

const placeSearcher = new PlaceSearcher();

function turnToLoadingMode() {
    //this functions changes all weather icons to a loading gif, and changes all temperature info to "?";
    const loadingGifSrc = './images/icons/loading.gif';
    const currentDayImg = weatherUpdater.currentDayInfo.img;
    const currentTemp = weatherUpdater.currentDayInfo.temp;
    const weatherInfo = weatherUpdater.currentDayInfo.weatherInfo;
    currentTemp.innerHTML = '?';
    weatherInfo.innerHTML = '-';
    currentDayImg.src = loadingGifSrc;

    weatherUpdater.cards.forEach(card=>{
        const temperatures = card.querySelectorAll('span');
        temperatures.forEach(temp=>{
            temp.innerHTML = '?';
        })
        const cardImg = card.querySelector('img');
        cardImg.src = loadingGifSrc;

    })
}
