const ipRegExp = new RegExp(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/,'i')
const domainRegExp = new RegExp(/(?:(?:(?<thld>[\w\-]*)(?:\.))?(?<sld>[\w\-]*))\.(?<tld>[\w\-]*)/,'i')
const MAP_TOKEN = 'pk.eyJ1IjoieGVvbnJpZGVyIiwiYSI6ImNrZmkydTBnNzAzd24yd3FiNXRzb21laGgifQ.owsPKYbZ0PT_6fgOqYQ_fg'
const IP_API_KEY ='at_qCntz3vCXjuld1TlzkCPJwBwU2Z84'
const API_URL = 'https://geo.ipify.org/api/v1'
const search = document.querySelector('#search')
const input = document.querySelector('.search-bar')
const dataValues = document.querySelectorAll('h3')
const IP = 0
const LOCATION = 1
const TIMEZONE = 2
const ISP = 3

window.addEventListener('DOMContentLoaded', () => fetchLocation(''));
search.addEventListener('submit', event => handleSubmit(event))

const handleSubmit = e => {
    e.preventDefault()
    if(input.value){
        const ipToFind = input.value
        input.value = ''
        if(ipRegExp.test(ipToFind) || domainRegExp.test(ipToFind)){
            fetchLocation(ipToFind)
        }else{
            alert('Please, enter a valid IP Address or domain')
        }
    }
}
const fetchLocation = async ipToFind => {
    let paramName = ''
    if(ipRegExp.test(ipToFind)) paramName ='&ipAddress='
    if(domainRegExp.test(ipToFind)) paramName = '&domain='    
    await fetch(`${API_URL}?apiKey=${IP_API_KEY}${paramName}${ipToFind}`).then( res => {
        if(res.ok) return res.json()
        else throw Error(res.status)
    }).then( data => {
        consumeAPI(data)
    }).catch( () => alert('Please, enter a valid IP Address or domain'))
}
const consumeAPI = data => {
    const {ip, location, isp} = data
    const formattedLocation = `${location.city}, ${location.region} ${location.postalCode}`
    dataValues[IP].innerText = ip
    dataValues[LOCATION].innerText = formattedLocation
    dataValues[TIMEZONE].innerText = `UTC ${location.timezone}`
    dataValues[ISP].innerText = isp
    refreshMap(location.lng,location.lat)
}
const refreshMap = (lon,lat) =>{
    mapboxgl.accessToken = MAP_TOKEN
    let map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lon,lat], 
        zoom: 13 
    })    
    new mapboxgl.Marker({
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
