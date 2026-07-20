const username = "c59d4401-3b7d-4e78-b9e2-1afbe0837c84"
const password = "c3cfeb44eda07f482852183e90e9279d784ac4ed28276538c8fe3c530c14952fb5c1af16e8a654b7d7edd9a9bbff2b71fc71329bbb7604e72666fcdb258fa5d5a333f649bf6e4402c719e7e4a9708483deea49008600f0f39053c91a794718f10794a3b4bddb165967a67b143dfab59d"

// const today = new Date(2025, 4, 6, 11, 45)
const today = new Date()
console.log("date=", today)
const date = (today.getFullYear()) + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + (today.getDate()).toString().padStart(2, "0")

let lat = 43.161030
let long = -77.610924

function showPosition(pos) {
    lat = pos.coords.latitude
    long = pos.coords.longitude
}

const requestBody = {
    "format": "svg",
    "style": {
        "moonStyle": "default",
        "backgroundStyle": "stars",
        "backgroundColor": "black",
        "headingColor": "none",
        "textColor": "black"
    },
    "observer": {
        "latitude": lat, // make based on viewer location?
        "longitude": long, // same as above
        "date": date // make the current date
    },
    "view": {
        "type": "portrait-simple",
        "orientation": "north-up"
    },
}

const headers = new Headers()
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));

async function getMoon() {
    const url = "https://api.astronomyapi.com/api/v2/studio/moon-phase"
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: headers,
    })

    if (!response.ok) {
        throw new Error(`Moon API request failed with status ${response.status}`)
    }

    const result = await response.json();
    return result.data.imageUrl
}

async function getPhase() {
    const url = "https://aa.usno.navy.mil/api/celnav?ID=Knightingale&date=" + date + "&time=" + "00:00" + "&coords=" + lat + ", " + long + ""
    const response = await fetch(url, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error(`Phase request failed with status ${response.status}`)
    }

    const result = await response.json();
    console.log(result)
    return result.properties
}

let image = ""
let moonIsFlipped = false
let properties = ""

function flippedMoon() {
    moonIsFlipped = !moonIsFlipped
    const pictureImg = document.getElementById("moon-image");
    const moonPhaseDesc = document.getElementById("moon-phase-name");
    const moonIllumPerc = document.getElementById("moon-illum-perc");
    if (moonIsFlipped) {
        pictureImg.style.display = "none"
        moonIllumPerc.style.display = "block"
        moonPhaseDesc.style.display = "block"
    }
    else {
        pictureImg.style.display = "block"
        moonIllumPerc.style.display = "none"
        moonPhaseDesc.style.display = "none"
    }
}

function goTo(target) {
    window.open(target, '_blank')
}

document.addEventListener("DOMContentLoaded", async function () {
    try {
        image = await getMoon()
        properties = await getPhase()
        const picture = document.getElementById("moon-image");
        picture.src = image

        const moonPhaseDesc = document.getElementById("moon-phase-name");
        const moonIllumPerc = document.getElementById("moon-illum-perc");

        moonPhaseDesc.innerHTML = properties.moon_phase
        moonIllumPerc.innerHTML = properties.moon_illum + "% Illuminated"

        moonPhaseDesc.style.display = "none"
        moonIllumPerc.style.display = "none"
    } catch (error) {
        console.error("Unable to load moon image:", error)
    }
});