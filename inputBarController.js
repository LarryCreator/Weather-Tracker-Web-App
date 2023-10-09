class InputBarController {
  constructor() {
    this.inputBarElement = document.getElementById('searcherInput');
    this.isFocused = false;
    this.getWeatherInfo = this.getWeatherInfo.bind(this);
    this.initializeInputBar();
  }
  initializeInputBar() {
    this.inputBarElement.addEventListener('focus', ()=>{
      this.isFocused = true;
    });
    this.inputBarElement.addEventListener('blur', ()=>{
      this.isFocused = false;
    })
    document.addEventListener('keydown', this.getWeatherInfo);
  }
  getWeatherInfo(e) {
    if (e.key == 'Enter' && this.isFocused && this.inputBarElement.value) {
      const place = this.inputBarElement.value;
      const placeExists = placeSearcher.updatePlaceAndCountry(place, placeSearcher.placeElement, placeSearcher.countryElement);
      if (placeExists) {
          placeSearcher.search(place);
      }
      this.inputBarElement.value = '';
    }
  }
}

const inputBarController = new InputBarController();