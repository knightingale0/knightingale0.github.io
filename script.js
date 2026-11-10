// astronomy api keys
const username = "c59d4401-3b7d-4e78-b9e2-1afbe0837c84"
const password = "c3cfeb44eda07f482852183e90e9279d784ac4ed28276538c8fe3c530c14952fb5c1af16e8a654b7d7edd9a9bbff2b71fc71329bbb7604e72666fcdb258fa5d5a333f649bf6e4402c719e7e4a9708483deea49008600f0f39053c91a794718f10794a3b4bddb165967a67b143dfab59d"

// astroApi
const key = "d42a542a0827a3b3d659dba3bdca8bd532410a79331512b81660f081344d7d0f"

const today = new Date()
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
        "latitude": lat, // make based on viewer location at some point
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
  const dateFormatted =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const params = new URLSearchParams({
    date: `${dateFormatted}T${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`,
    lat: String(lat),
    lon: String(long),
    tz_str: "AUTO",
    include_visuals: "false",
    include_interpretation: "false",
    include_traditional_moon: "false",
  });

  const response = await fetch(
    `https://api.freeastroapi.com/api/v1/moon/phase?${params}`,
    {
      headers: {
        "x-api-key": key,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Phase request failed (${response.status}): ${await response.text()}`);
  }

  const result = await response.json();
  return result.phase;
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
        // phaseInfo = await getPhase()
        const picture = document.getElementById("moon-image");
        picture.src = image

        // const moonPhaseDesc = document.getElementById("moon-phase-name");
        // const moonIllumPerc = document.getElementById("moon-illum-perc");

        // moonPhaseDesc.innerHTML = phaseInfo.name
        // moonIllumPerc.innerHTML = phaseInfo.illumination + "% Illuminated"

        moonPhaseDesc.style.display = "none"
        moonIllumPerc.style.display = "none"
    } catch (error) {
        console.error("Unable to load moon image:", error)
    }
});