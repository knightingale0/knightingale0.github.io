
let USER_DUCKS = []
let FIELD_DUCKS = []
let USER_ITEMS = []
let FIELD_ITEMS = []
// save gamestates (time, weather, acheivements/points)
let COUNTER = 1
let formatted_names = []

function loadDucks() {
    let duckList = document.getElementById("duck-list");
    let listString = "<ul class='styled-list'>"

    if (USER_DUCKS && USER_DUCKS.length > 0) {

        USER_DUCKS.map(duck => {
            let image = duck.split('"')[15]
            let name = duck.split('"')[1]
            let id = duck.split('"')[5]
            listString += `<li data-id="${id}" onclick="listItemToElementFromLI(this)"><img src='${image}'>${name}${duck}</li>`
        })

        duckList.innerHTML = listString
    } else {
        duckList.innerHTML = "<p>No Ducks D:</p>"
    }
    localStorage.setItem("user_ducks", JSON.stringify(USER_DUCKS))
    localStorage.setItem("counter", JSON.stringify(COUNTER))
}

function loadItems() {
    let itemList = document.getElementById("item-list");
    let listString = "<ul class='styled-list'>"

    if (USER_ITEMS && USER_ITEMS.length > 0) {
        USER_ITEMS.map(item => {
            let imagePath = item.split('"')[11]
            let name = item.split('"')[1]
            listString += `<li onclick="listItemToElementFromLI(this)"><img src='${imagePath}'>${name}${item}</li>`
        })
        itemList.innerHTML = listString
    } else {
        itemList.innerHTML = "<p>No items D:</p>"
    }
    localStorage.setItem("user_items", JSON.stringify(USER_ITEMS))
}

function resetItems() {
    USER_ITEMS = []
    localStorage.setItem("user_items", JSON.stringify(USER_ITEMS))
    loadItems()
}

function resetDucks() {
    USER_DUCKS = []
    localStorage.setItem("user_ducks", JSON.stringify(USER_DUCKS))
    loadDucks()
}

function resetAll() {
    USER_ITEMS = undefined
    USER_DUCKS = undefined
    COUNTER = 1
    localStorage.setItem("user_items", JSON.stringify(USER_ITEMS))
    localStorage.setItem("user_ducks", JSON.stringify(USER_DUCKS))
    localStorage.setItem("counter", JSON.stringify(COUNTER))
    loadDucks()
    loadItems()
}

function makeEgg(){
    let name=`egg`
    let image = "./images/egg.png"
    let egg = `<div data-name="${name}" data-status="3" data-id="${COUNTER}" class="thing item grab" style="left: 0px; top: 0px; z-index: 7;"><img src="${image}" alt=${name}></div>`

    COUNTER++
    return egg
}

function newDuck(parent1, parent2) {
    let sandwichDuckChance = Math.random()*5
    let eggDuckChance = Math.random()*10
    let mallardChance = Math.random()*10
    let name = `Duck #${COUNTER}`
    let imagePath = "images/duck.png"
    if (mallardChance < 5){
        imagePath = "./images/brownduckwithgreenhead.png"
    }
    let duck = `<div data-name="${name}" data-status="3" data-id="${COUNTER}" data-parent1="${parent1}" data-parent2="${parent2}" class="thing duck grab" style="left: 0px; top: 0px; z-index: 7;"><img src="${imagePath}" alt=${name}></div>`
    if (sandwichDuckChance < 2){
        name = "Sandwich Duck!"
        imagePath = "./images/breadduck.png"
        duck = `<div data-name="${name}" data-status="3" data-id="${COUNTER}" data-parent1="${parent1}" data-parent2="${parent2}" class="thing duck grab sandwich" style="left: 0px; top: 0px; z-index: 7;"><img src="${imagePath}" alt=${name}></div>`
    }
    if (eggDuckChance < 2){
        name = "Egg Duck!"
        imagePath = "./images/eggduck.png"
        duck = `<div data-name="${name}" data-status="3" data-id="${COUNTER}" data-parent1="${parent1}" data-parent2="${parent2}" class="thing duck grab egg" style="left: 0px; top: 0px; z-index: 7;"><img src="${imagePath}" alt=${name}></div>`
    }


    COUNTER++
    return duck
}

function newItem(name, image, food, grows) {
    let item
    if (food) {
        item = `<div data-name="${name}" data-type="food" class="thing item grab" style="left: 0px; top: 0px; z-index: 7; display: 'none'" data-id="${COUNTER}"><img src="${image}"></div>`
    } else if (grows) {
        item = `<div data-name="${name}" data-type="plant" data-growtime="60" class="thing item grab" style="left: 0px; top: 0px; z-index: 7; display: 'none'" data-id="${COUNTER}"><img src="${image}"></div>`
    } else {
        item = `<div data-name="${name}" "" class="thing item grab" style="left: 0px; top: 0px; z-index: 7; display: 'none'" data-id="${COUNTER}"><img src="${image}"></div>`
    }
    COUNTER++
    return item
}

function generateNewDuck() {
    let duck = newDuck(-1, -1)
    if (!USER_DUCKS) {
        USER_DUCKS = []
    }
    USER_DUCKS.push(duck)
    loadDucks()
}

function generateHammer() {
    let hammer = newItem("Hammer", "./images/hammer.png")
    dragElement(hammer)
    if (!USER_ITEMS) {
        USER_ITEMS = []
    }
    USER_ITEMS.push(hammer)
    loadItems()
}

/**
 * Code that runs on page loading
 */
window.addEventListener("load", (e) => {
    console.log("window loaded")

    let localCounter = localStorage.getItem("counter")
    let counter = undefined
    if (localCounter != "undefined" && localCounter != null) {
        counter = JSON.parse(localStorage.getItem("counter"))
    }
    COUNTER = counter

    let localDucks = localStorage.getItem("user_ducks")
    let localItems = localStorage.getItem("user_items")

    let user_ducks = undefined
    if (localDucks != "undefined") {
        user_ducks = JSON.parse(localStorage.getItem("user_ducks"))
    }
    let user_items = undefined
    if (localItems != "undefined") {
        user_items = JSON.parse(localStorage.getItem("user_items"))
    }

    USER_DUCKS = user_ducks
    USER_ITEMS = user_items

    if (USER_DUCKS == undefined) {
        USER_DUCKS = []
        USER_DUCKS.push(newDuck(-1, -1))
        USER_DUCKS.push(newDuck(-1, -1))
    }

    if (USER_ITEMS == undefined) {
        USER_ITEMS = []
        USER_ITEMS.push(newItem("Apple", "./images/apple.png", food=true))
        USER_ITEMS.push(newItem("Seed", "./images/plant2.png", false, true))
        USER_ITEMS.push(newItem("Hammer", "./images/hammer.png"))
    }

    loadDucks()
    loadItems()
});


