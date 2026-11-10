const today = new Date()
const date = (today.getFullYear()) + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + (today.getDate()).toString().padStart(2, "0")

function goTo(target) {
    window.open(target, '_blank')
}

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Welcome to my site :D")
});