const search = document.querySelector('#search')
const dataValues = document.querySelectorAll('h3')
const IP = 0
const LOCATION = 1
const TIMEZONE = 2
const ISP = 3


window.addEventListener("DOMContentLoaded", init);
document.getElementById('search').addEventListener('submit', handleSubmit)

const moveMap = (lat,lon) =>{
    const mymap = L.map('mapid').setView([51.505, -0.09], 13);
}
const init = () => {
    fetch('https://ipapi.co/json/').then( res => {
        return res.json();
    }).then( data => {
        const { ip, city, region_code, latitude, longitude, utc_offset, org} = data
        dataValues[IP].innerHTML = ip
        dataValues[LOCATION].innerHTML = `${city}, ${region_code}`
        const formattedUTC = `${utc_offset.substring(0,3)}:${utc_offset.substring(3,5)}`
        dataValues[TIMEZONE].innerHTML = `UTC ${formattedUTC}`
        dataValues[ISP].innerHTML = org
        moveMap(latitude,longitude)
    })
}
const handleSubmit = e => {
    console.log(e);
}