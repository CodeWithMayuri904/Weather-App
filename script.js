
const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.city-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-text')
const tempTxt = document.querySelector('.temp-txt')
const conditionText = document.querySelector('.condition-txt')
const currentDateTxt = document.querySelector('.current-date-text')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherInfoImg = document.querySelector('.weather-cloud-img')

const forecastItems = document.querySelector('.forecast-items-container')


const apiKey = '0e2cd3d2e7f035650e57f3d603abc249'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

cityInput.addEventListener("keydown", (event) => {
    if(event.key == "Enter" && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }  
})


async function getWeather(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    } 
    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}


async function updateWeatherInfo(city) {
    const weatherData = await getWeather('weather', city)

    if(weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return 
    }
    console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity},
        weather : [{ id, main}],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionText.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()

    weatherInfoImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
} 

async function updateForecastsInfo(city) {
    const forecastsData = await getWeather('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItems.innerHTML = ''

    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastsItems(forecastWeather)
        }
    })

}

function updateForecastsItems(weatherData) {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}</h5>
        </div>
    `
    forecastItems.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(activeSection) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none') 

    activeSection.style.display = 'flex'
}



