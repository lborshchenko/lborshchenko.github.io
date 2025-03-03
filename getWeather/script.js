'use strict'
const KEY = 'b8944d30b6ca44f2a71162105250103'
const weatherSection = document.querySelector('.weather')
const inputCity = document.querySelector('.header__search')
const searchButton = document.querySelector('.header__button')
const weatherMain = document.querySelector('.weather__main-info')
const weatherCards = document.querySelectorAll('.weather-week__card')
const logo = document.querySelector('.header__logo-text')

const weatherMainInfo = {
    city: document.querySelector('.weather__main-info__city'),
    date: document.querySelector('.weather__main-info__date'),
    grad: document.querySelector('.weather__main-info__grad'),
    currentWeather: document.querySelector('.weather__main-info__weather-now'),
    image: document.querySelector('.weather__main-info__image'),
    feels: document.querySelector('.weather__main-info__feels'),
    wind: document.querySelector('.weather__main-info__wind'),
    humidity: document.querySelector('.weather__main-info__humidity'),


}



searchButton.addEventListener('click', () => {
    render()
})
inputCity.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        render()
    }
})




class weatherCard {
    constructor(date, grad, current, image) {
        this.date = date // weatherCards[0].firstElementChild.firstElementChild.firstElementChild.textContent)
        this.grad = grad      // weatherCards[0].firstElementChild.firstElementChild.lastElementChild
        this.current = current     // weatherCards[0].firstElementChild.firstElementChild.nextElementSibling
        this.image = image
    }
}

    
function render() {
    const searchCity = inputCity.value
    inputCity.value = ''
    getWeather(searchCity)
    .then(data => {
        console.log(data)
        const dayTime = setDayTime(data.location.localtime)


        weatherMainInfo.city.textContent = data.location.name
        textPrinting(weatherMainInfo.city, weatherMainInfo.city.textContent, 200, 70)
        weatherMainInfo.date.textContent = getDate(data.location.localtime)
        textPrinting(weatherMainInfo.date, weatherMainInfo.date.textContent, 200, 70)
        weatherMainInfo.grad.textContent = `Температура: ${Math.round(data.current.temp_c)}C°`
        textPrinting(weatherMainInfo.grad, weatherMainInfo.grad.textContent, 200, 70)
        weatherMainInfo.currentWeather.textContent = data.current.condition.text
        textPrinting(weatherMainInfo.currentWeather, weatherMainInfo.currentWeather.textContent, 200, 70)
        weatherMainInfo.feels.textContent = `Ощущается как: ${data.current.feelslike_c}C°`
        textPrinting(weatherMainInfo.feels, weatherMainInfo.feels.textContent, 200, 70)
        weatherMainInfo.wind.textContent = `Скорость ветра: ${data.current.wind_kph} км\ч`
        textPrinting(weatherMainInfo.wind, weatherMainInfo.wind.textContent, 200, 70)
        weatherMainInfo.humidity.textContent = `Влажность: ${data.current.humidity} %`
        textPrinting(weatherMainInfo.humidity, weatherMainInfo.humidity.textContent, 200, 70)


        weatherMainInfo.image.setAttribute('src', `icons/${setWeatherImage(data.current.condition.text, dayTime)}`)
        
        const days = data.forecast.forecastday
        
        for (let i=0; i < days.length -1; i++) {
            const currentDay = days[i + 1]
            const card = new weatherCard(
                weatherCards[i].firstElementChild.firstElementChild.firstElementChild,
                weatherCards[i].firstElementChild.firstElementChild.lastElementChild,
                weatherCards[i].firstElementChild.firstElementChild.nextElementSibling,
                weatherCards[i].firstElementChild.nextElementSibling
                
            )

            card.date.textContent = getDate(currentDay.date)
            textPrinting(card.date, card.date.textContent, 200, 70)
            card.grad.textContent = currentDay.day.avgtemp_c + 'C°'
            textPrinting(card.grad, card.grad.textContent, 200, 70)
            card.current.textContent = currentDay.day.condition.text
            textPrinting(card.current, card.current.textContent, 200, 70)
            card.image.setAttribute('src', `icons/${setWeatherImage(currentDay.day.condition.text, 'day')}`)
        }
    })
}




async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${city}&lang=ru&days=4`)
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}`)
        }

        const data = await response.json()
        weatherSection.classList.remove('hidden')
        return data
    }
    catch (error) {
        console.error(`Ошибка: ${error}`)
        
    }
}



async function  textPrinting(DOMElement, text, time, time2) {

    function randomFromArray(array) {
      return array[Math.floor(Math.random() * array.length)]
    }
  
  
    const trueText = text.split('')
    const fakeText = []
    const finalText = []
    const symbols = 'qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()_+{}:"<>?|-=[];/.,'.split('')
    const result = ''
   
    for(let i = 0; i < trueText.length; i++) {
     const interval =  setInterval(() => {
        fakeText[i] = randomFromArray(symbols)
        DOMElement['textContent'] = finalText.join('') + fakeText[i] + '|'
        
      }, 100)
  
      setTimeout(() => {
        clearInterval(interval)
        DOMElement['textContent'] = finalText.join('')
      }, trueText.length * time2)
  
      await new Promise (resolve => setTimeout(resolve, time))
      finalText[i] = trueText[i]
      fakeText[i] = trueText[i]    
  
      
    }
  
  }


  function getDate(date) {
    const months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
    const formatDate = new Date(date)
    const time = formatDate.getHours()
    const day = formatDate.getDate()
    const month = formatDate.getMonth()

    return `${day} ${months[month]}`
}

function setDayTime(time) {
    let currentHour = new Date(time).getHours()

    if (currentHour > 17) {
        return 'night'
    }
    else {
        return 'day'
    }
    
}

function setWeatherImage(weather, dayTime) {
    const weatherText = weather.toLowerCase()
    if (weatherText === 'солнечно') {
        return 'clear.svg'
    }
    else if (weatherText === 'ясно') {
        return 'clear-night.svg'
    }
    else if (weatherText.includes('облачн') && dayTime == 'day' || weatherText.includes('пасмурн') && dayTime == 'day') {
        return 'cloudy.svg'
    }
    else if (weatherText.includes('облачн') && dayTime == 'night' || weatherText.includes('пасмурн') && dayTime =='night') {
        return 'cloudy-night.svg'
    }
    else if (weatherText.includes('гроз') || weatherText === 'дождь с грозой') {
        return 'thunder.svg'
    }
    else if (weatherText.includes('дождь') || weatherText.includes('ливн') || weatherText.includes('морось')) {
        return 'rain.svg'
    }
    else if (weatherText.includes('снег') || weatherText.includes('метель')|| weatherText.includes('поземок')) {
        return 'snow.svg'
    }
    else if (weatherText.includes('туман') || weatherText.includes('дымка')) {
        return 'smoke.svg'
    }
}


textPrinting(logo, 'getWeather()', 500, 100)

