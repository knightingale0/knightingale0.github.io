const dragElement = (element) => {
    // Keeps track of the cursor's starting positions
    let shiftX = 0;
    let shiftY = 0;

    const dragMouseDown = (e) => {
        e.preventDefault(); // Prevents default browser text selection

        shiftX = e.clientX - element.getBoundingClientRect().left;
        shiftY = e.clientY - element.getBoundingClientRect().top;

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
        element.style.cursor = 'grabbing';
        element.style.zIndex = 15;

        element.held = true;
        delete element.dataset.despawn;

        field.appendChild(element); // puts to end (top)
    };

    const elementDrag = (e) => {
        e.preventDefault();

        // Calculate the new coordinates relative to the viewport
        let newX = e.clientX - shiftX;
        let newY = e.clientY - shiftY;

        // Apply the updated coordinates to the element styles
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    };

    const closeDragElement = () => {
        // Stop moving when mouse button is released by cleaning up the listeners
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
        element.style.cursor = 'grab';
        element.style.zIndex = 7;

        element.held = false;

        onDrop(element);
    };

    // Trigger the process when the user clicks down on the element
    element.addEventListener('mousedown', dragMouseDown);
};


function num(n) {
    return Number(n.replace("px", ""));
};

function tick() {
    for (let thing of document.querySelectorAll("#field .thing")) {
        if (thing.dataset.despawn) {
            thing.dataset.despawn -= 1;
            if (thing.dataset.despawn <= 0) {
                thing.remove();
            }
        }
        if (thing.dataset.hatchTime) {
            thing.dataset.hatchTime -= 1;
            if (thing.dataset.hatchTime <= 0){
                thing.remove()
                let dnew = strToElem(newDuck(1, 2))
                dragElement(dnew)
                dnew.style.left = thing.style.left;
                dnew.style.top = thing.style.top;
                field.appendChild(dnew);
            }
        }
        if (thing.dataset.growtime){
            console.log(thing.dataset.growtime+ "- for " + thing.dataset.name)
            thing.dataset.growtime -=1;
            // stage at 25 - image change
            if (thing.dataset.growTime <= 35){
                thing.firstChild.src = "./images/plant2.png"
            }
            // stage at 60 - can bonk for apples
            if (thing.dataset.growtime <= 0){
                thing.firstChild.src = "./images/tree.png"
                thing.style.width = "192px";
                thing.style.height = "256px";
                thing.classList.add("tree")
            }
        }
    }

    for (let duck of document.querySelectorAll("#field .duck")) {
        if (!duck.dataset.walkX && Math.random() < 0.25 / TPS) {
            let pos = randomInBounds(field, duck);
            duck.dataset.walkX = pos.x;
            duck.dataset.walkY = pos.y;
        }

        if (duck.dataset.walkX) {
            let normX = duck.dataset.walkX - num(duck.style.left);
            let normY = duck.dataset.walkY - num(duck.style.top);
            let len = Math.sqrt(normX * normX + normY * normY);

            normX /= len;
            normY /= len;

            normX *= Math.min(len, 50 / TPS);
            normY *= Math.min(len, 50 / TPS);

            if (normX < 0) {
                duck.querySelector('img').style.transform = 'scaleX(-1)';
            }
            else {
                duck.querySelector('img').style.transform = 'scaleX(1)';
            }

            duck.style.left = num(duck.style.left) + normX + "px";
            duck.style.top = num(duck.style.top) + normY + "px";

            if (Math.abs(num(duck.style.left) - duck.dataset.walkX) < 1 && Math.abs(num(duck.style.top) - duck.dataset.walkY) < 1) {
                delete duck.dataset.walkX;
                delete duck.dataset.walkY;
            }
        }
    }

    for (let thing of document.querySelectorAll("#field .thing:not(.controls)")) {
        if (thing.held) continue;
        thing.style.left = Math.max(bounds(field).minx, Math.min(num(thing.style.left), bounds(field).maxx - bounds(thing).width)) + "px";
        thing.style.top = Math.max(bounds(field).miny, Math.min(num(thing.style.top), bounds(field).maxy - bounds(thing).height)) + "px";
    }


    //spawn fih
    if (Math.random() < 0.05 / TPS) {
        let fih = document.createElement("div");
        fih.className = "thing item grab fih";
        fih.innerHTML = '<img src="images/fih.png" width="100%">';
        field.appendChild(fih);

        const pond = document.querySelector("#field .pond");

        let pos = randomInBounds(pond, fih);
        fih.style.left = pos.x + "px";
        fih.style.top = pos.y + "px";

        fih.dataset.despawn = 5 * TPS;
        fih.dataset.name = "FIH";
        fih.dataset.type = "food";

        dragElement(fih);
    }

}

// called when a [thing] is dropped
function onDrop(thing) {
    if (thing.classList.contains("item") && overlaps(thing, itemStorage)) {
        itemToList(thing, document.querySelector('#item-list>ul'));
        return;
    }

    if (thing.classList.contains("duck") && overlaps(thing, duckStorage)) {
        itemToList(thing, document.querySelector('#duck-list>ul'));
        return;
    }

    let near = nearest(thing);
    if (near && near.id == "garbage-can") {
        thing.remove();
    }

    if (thing.classList.contains('duck')) {
        if (near && overlaps(near, thing) && near.classList.contains('duck')) {
            let dnew = strToElem(makeEgg());

            field.appendChild(dnew);
            dnew.dataset.hatchTime = 10*TPS
            dnew.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
            dnew.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";

            dragElement(dnew);
        }

        if (near && overlaps(near, thing) && near.classList.contains('pond')) {
            thing.firstChild.src = "./images/fisherduck.png"
            thing.dataset.name = `Fisher Duck`
            thing.classList.add("fisher")
        }
    }

    if (thing.classList.contains("item")) {
        if (near && overlaps(thing, near) && near.classList.contains("duck")) {
            if (thing.dataset.type == "food") {
                near.style.width = bounds(near).width * 1.5 + "px";
                thing.remove();
            }
        }
    }

    //hammer squishing things
    if (thing.dataset.name == "Hammer") {
        if (near && overlaps(thing, near)) {
            var snd = new Audio("./images/bonk.wav"); // buffers automatically when created
            snd.play();
            near.style.transform = 'scaleY(0.5)';
            setTimeout(() => { near.style.transform = '' }, 1500);

            if (near.classList.contains('duck')) {
                delete near.dataset.walkX;
                delete near.dataset.walkY;
            }
            if (near.classList.contains('sandwich')) {
                near.classList.remove('sandwich')

                near.firstChild.src = "./images/duck.png"
                near.dataset.name = `Duck #${near.dataset.id}`

                let breadnew = strToElem(newItem("Bread", "./images/bread.png", food = true));

                field.appendChild(breadnew);
                breadnew.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
                breadnew.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";

                dragElement(breadnew);
            }
            if (near.classList.contains('fisher')) {
                near.classList.remove('fisher')

                near.firstChild.src = "./images/duck.png"
                near.dataset.name = `Duck #${near.dataset.id}`

                let fishChoice = Math.random()*5
                let image;
                if (fishChoice < 2){
                    image = "./images/bigfish.png"
                } else if (fishChoice > 4) {
                    image = "./images/krillion.png"
                } else {
                    image = "./images/jellyfih.png"
                }

                let fishNew = strToElem(newItem("Fish", image, food = true));

                field.appendChild(fishNew);
                fishNew.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
                fishNew.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";

                dragElement(fishNew);
            }
            if (near.classList.contains('egg')) {
                near.classList.remove('egg')

                near.firstChild.src = "./images/duck.png"
                near.dataset.name = `Duck #${near.dataset.id}`
            }
            if (near.classList.contains('tree')) {

                let appleNew = strToElem(newItem("Apple", "./images/apple.png", food = true));

                field.appendChild(appleNew);
                appleNew.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
                appleNew.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";

                dragElement(appleNew);
            }
            if (near.dataset.name =='Apple') {

                near.remove();

                let s1 = strToElem(newItem("Seed", "./images/plant1.png", false, true));
                let s2 = strToElem(newItem("Seed", "./images/plant1.png", false, true));

                field.appendChild(s1);
                field.appendChild(s2);
                s1.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
                s1.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";
                s2.style.left = (num(thing.style.left) + num(near.style.left)) / 2 + "px";
                s2.style.top = (num(thing.style.top) + num(near.style.top)) / 2 + "px";

                dragElement(s1);
                dragElement(s2);
            }
        }
    }
}


//find nearest thing to [to]
function nearest(to) {
    let out = undefined;
    let bestDist = Infinity;

    let midx = bounds(to).midx;
    let midy = bounds(to).midy;

    for (let thing of document.querySelectorAll("#field .thing")) {
        if (thing == to) continue;

        let d = Math.sqrt(Math.pow(midx - bounds(thing).midx, 2) + Math.pow(midy - bounds(thing).midy, 2));

        if (d < bestDist) {
            out = thing;
            bestDist = d;
        }
    }

    return out;
};

//do two things overlap
function overlaps(a, b) {
    return (!(
        (bounds(a).minx > bounds(b).maxx || bounds(b).minx > bounds(a).maxx) ||
        (bounds(a).miny > bounds(b).maxy || bounds(b).miny > bounds(a).maxy)
    ));
};


function randomInBounds(boundNode, placedNode) {
    return {
        x: bounds(boundNode).minx + Math.random() * (bounds(boundNode).width - bounds(placedNode).width),
        y: bounds(boundNode).miny + Math.random() * (bounds(boundNode).height - bounds(placedNode).height)
    }
}


let field;
function bounds(e) {
    let x = e.getBoundingClientRect().x;
    let y = e.getBoundingClientRect().y;
    let width = e.getBoundingClientRect().width;
    let height = e.getBoundingClientRect().height;
    return {
        minx: x,
        maxx: x + width,
        miny: y,
        maxy: y + height,
        width: width,
        height: height,
        midx: x + width * 0.5,
        midy: y + height * 0.5
    };
}

function strToElem(str) {
    const template = document.createElement('template');
    template.innerHTML = str.trim();
    return template.content.firstElementChild;
}



const TPS = 5;

let duckStorage;
let itemStorage;
window.addEventListener("load", (e) => {
    field = document.getElementById("field");
    duckStorage = document.getElementById("duck-storage");
    itemStorage = document.getElementById("item-storage");

    for (let grab of document.querySelectorAll(".grab")) {
        dragElement(grab);
    }

    setInterval(tick, 1000 / TPS);

});




