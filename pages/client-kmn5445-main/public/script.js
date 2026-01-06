function selectDichotomy() {
    let choice = document.getElementById('button-choice').value

    let a = "1"
    let b = "2"
    let title = "Title"

    if (choice == "mature") {
        a = "Adult"
        b = "Juvenile"
        title = "Maturity"
    } else if (choice == "sex") {
        a = "Male"
        b = "Hermaphrodite"
        title = "Sex"
    } else if (choice == "coord") {
        a = "Coordinated"
        b = "Uncoordinated"
        title = "Coordination"
    } else if (choice == "mutant") {
        a = "Mutant"
        b = "Normal"
        title = "Mutations"
    }

    document.getElementById("option1").innerHTML = a
    document.getElementById("option2").innerHTML = b
    document.getElementById("count-type").innerHTML = title
    resetCounts();
}

function upCount1() {
    let choice = document.getElementById('button-choice').value
    if (choice != "none") {
        let number = parseInt(document.getElementById("count1").innerHTML)
        document.getElementById("count1").innerHTML = number + 1
    }
}

function upCount2() {
    let choice = document.getElementById('button-choice').value
    if (choice != "none") {
        let number = parseInt(document.getElementById("count2").innerHTML)
        document.getElementById("count2").innerHTML = number + 1
    }
}

function resetCounts() {
    document.getElementById("count1").innerHTML = 0
    document.getElementById("count2").innerHTML = 0
}

function save() {
    let title = document.getElementById("count-type").innerHTML

    let c1 = document.getElementById("count1").innerHTML
    let num1 = parseInt(c1)
    let c1Name = document.getElementById("option1").innerHTML

    let c2 = document.getElementById("count2").innerHTML
    let num2 = parseInt(c2)
    let c2Name = document.getElementById("option2").innerHTML

    let experiment = document.getElementById("experiment-name").innerHTML
    let dish = document.getElementById("dish-name").innerHTML

    let ratio = num1 / (num2 + num1)
    let degree1 = 360 * ratio

    let target = document.getElementById("result-counts")
    let existing = target.innerHTML

    let logHeader = "<h3>" + experiment + " - " + dish + "</h3>" + "<h4>" + title + "</h4>"
    let logCount1 = "<p>Red - " + c1Name + ": " + c1 + " - " + Math.round(ratio * 100) + "%</p>"
    let logCount2 = "<p>Blue - " + c2Name + ": " + c2 + " - " + Math.round((1 - ratio) * 100) + "%</p>"


    let chart = "<div style='width: 250px; height: 250px; border-radius: 50%;" +
        "background-image: conic-gradient( red  " + degree1 + "deg, blue 0 0deg);'></div>"

    if (!(num1 == 0 && num2 == 0) && !(title == "Title")) {
        target.innerHTML = "<section>" + logHeader + logCount1 + logCount2 + chart + "</section>" + existing
    }
    resetCounts()
}
