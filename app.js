const search = document.querySelector('#search')
const dataValues = document.querySelectorAll('h3')
const IP = 0
const LOCATION = 1
const TIMEZONE = 2
const ISP = 3
const ipRegExp = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}$','i')
const domainRegExp = new RegExp('(?:(?:(?<thld>[\w\-]*)(?:\.))?(?<sld>[\w\-]*))\.(?<tld>[\w\-]*)','i')


window.addEventListener("DOMContentLoaded", () => {init()});
document.getElementById('search').addEventListener('submit', event => {handleSubmit(event)})

const moveMap = (lat,lon) =>{
    const mymap = L.map('mapid').setView([lat, lon], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGVvbnJpZGVyIiwiYSI6ImNrZmkydTBnNzAzd24yd3FiNXRzb21laGgifQ.owsPKYbZ0PT_6fgOqYQ_fg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
let myIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [46,55]
})
let marker = L.marker([lat, lon],{icon:myIcon}).addTo(mymap);
}
const init = () => {
    fetch('https://ipapi.co/json/').then( res => {
        return res.json();
    }).then( data => {
        const { ip, city, region_code, latitude, longitude, utc_offset, org} = data
        const formattedUTC = `${utc_offset.substring(0,3)}:${utc_offset.substring(3,5)}`
        dataValues[IP].innerHTML = ip
        dataValues[LOCATION].innerHTML = `${city}, ${region_code}`
        dataValues[TIMEZONE].innerHTML = `UTC ${formattedUTC}`
        dataValues[ISP].innerHTML = org
        moveMap(latitude,longitude)
    })
}
const findIP = ipToFind => {
    if(ipRegExp.test(ipToFind)){
console.log(`ip: ${ipToFind}`);
}
else{
    console.log(`domain: ${ipToFind}`);
    }
    // dataValues[IP].innerHTML = ip
    // dataValues[LOCATION].innerHTML = `${city}, ${region_code}`
    // dataValues[TIMEZONE].innerHTML = `UTC ${formattedUTC}`
    // dataValues[ISP].innerHTML = org
    // moveMap(latitude,longitude)
}
const handleSubmit = e => {
    e.preventDefault()
    const ipToFind= e.target.querySelector('input').value
    e.target.querySelector('input').value = ''
    if(ipRegExp.test(ipToFind) || domainRegExp.test(ipToFind)){
        findIP(ipToFind)
    }else{
        alert('Please, enter a valid IP Address or domain')
    }
}