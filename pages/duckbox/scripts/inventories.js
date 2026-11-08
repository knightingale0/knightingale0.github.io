function itemToList(element, list) {
    console.log("item to list", element);
    let listItem = document.createElement("li");

    listItem.innerHTML += element.innerHTML + element.dataset.name;
    listItem.appendChild(element);  
    console.log(listItem)
    listItem.setAttribute('onclick', "listItemToElementFromLI(this)")  
  
    element.style.display = 'none';
    list.appendChild(listItem);
}

function listItemToElementFromLI(item) {
    console.log("AGH - return to field: ", item);
    let element = item.querySelector(".thing:not(.controls)");
    element.style.display = "block";
    field.appendChild(element);
    item.remove();
}
