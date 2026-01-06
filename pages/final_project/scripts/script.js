

document.getElementById('hamburger').addEventListener('click', clickMenu);

function clickMenu() {
    let nav = document.querySelector('nav');

    nav.classList.toggle("shown")
    document.querySelector('section').classList.toggle("shown")
}