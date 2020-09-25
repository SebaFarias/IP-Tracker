const search = document.querySelector('#search')
const input = document.querySelector('.search-bar')
const dataValues = document.querySelectorAll('h3')
const IP = 0
const LOCATION = 1
const TIMEZONE = 2
const ISP = 3
const ipRegExp = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}$','i')
const domainRegExp = new RegExp('(?:(?:(?<thld>[\w\-]*)(?:\.))?(?<sld>[\w\-]*))\.(?<tld>[\w\-]*)','i')
const API_URL = 'https://geo.ipify.org/api/v1'
const MAP_TOKEN = 'pk.eyJ1IjoieGVvbnJpZGVyIiwiYSI6ImNrZmkydTBnNzAzd24yd3FiNXRzb21laGgifQ.owsPKYbZ0PT_6fgOqYQ_fg'
const IP_API_KEY ='at_qCntz3vCXjuld1TlzkCPJwBwU2Z84'

window.addEventListener("DOMContentLoaded", () => init());
search.addEventListener('submit', event => handleSubmit(event))

const init = () => {
    fetch(`${API_URL}?apiKey=${IP_API_KEY}`).then( res => {
            return res.json()
        }).then( data => {
            consumeAPI(data)
        })
}
const handleSubmit = e => {
    e.preventDefault()
    const ipToFind= input.value
    input.value = ''
    if(ipRegExp.test(ipToFind) || domainRegExp.test(ipToFind)){
        findIP(ipToFind)
    }else{
        alert('Please, enter a valid IP Address or domain')
    }
}
const findIP = ipToFind => {
    if(ipRegExp.test(ipToFind)){
        fetch(`${API_URL}?apiKey=${IP_API_KEY}&ipAddress=${ipToFind}`).then( res => {
            return res.json()
        }).then( data => {
            consumeAPI(data)
        })
    }else{
        fetch(`${API_URL}?apiKey=${IP_API_KEY}&domain=${ipToFind}`).then( res => {
            return res.json()
        }).then( data => {
            consumeAPI(data)
        })
    }
}
const consumeAPI = data => {
    const {ip, location, isp} = data
    const formattedLocation = `${location.city}, ${location.region} ${location.postalCode}`
    dataValues[IP].innerText = ip
    dataValues[LOCATION].innerText = formattedLocation
    dataValues[TIMEZONE].innerText = `UTC ${location.timezone}`
    dataValues[ISP].innerText = isp
    refreshMap(location.lat,location.lng)
}
const refreshMap = (lat,lon) =>{
    mapboxgl.accessToken = MAP_TOKEN
    var map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lon,lat], 
        zoom: 13 
    })    
    let marker = new mapboxgl.Marker({
        element: createMarker(),
        anchor: 'bottom'
    })
    .setLngLat([lon, lat])
    .addTo(map);
}
const createMarker = () => {
    const marker = document.createElement('div')
    marker.className = 'marker'
    marker.style.backgroundImage = 'url(/images/icon-location.svg)'
    marker.style.width = '46px';
    marker.style.height ='55px';
    return marker
}
