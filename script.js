var wrapper = document.querySelector(".wrapper");
var leftButton = document.querySelector(".triangle-left");
var rightButton = document.querySelector(".triangle-right");
var deleteButton = document.querySelector(".delete-btn");
var details = document.querySelector(".container__details");
var tableName = document.querySelector(".name");
var tableDate = document.querySelector(".date");
var tableGender = document.querySelector(".gender");
var listOfMovies = document.querySelector(".movies");
var tablePlanet = document.querySelector(".planet");
var tableSpecies = document.querySelector(".species");
var pageNumber = 1;
var status;
var persons;

window.addEventListener("load", arrangeElements);
wrapper.addEventListener("click", showDetails);
deleteButton.addEventListener("click", hideDetails);

//запрос на получние персонажей
function getData() {
    var url = "https://swapi.dev/api/people/?page=" + pageNumber;
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, false);

    xhr.onload = function () {
        if (xhr.status >= 400) {
            status = xhr.status;
            rightButton.removeEventListener("click", moveForward);
            pageNumber--;
        } else {
            status = xhr.status;
            persons = JSON.parse(xhr.response).results;
        }
    };

    xhr.send();
};

// отрисовка элементов
function arrangeElements() {
    getData();
    if (status < 400) {
        var currentPersons = document.querySelectorAll(".person");
        var personsAmount;

        if (currentPersons.length === persons.length) {
            fillElements();

        } else if (currentPersons.length < persons.length) {
            personsAmount = persons.length - currentPersons.length;

            for (var i = 0; i < personsAmount; i++) {
                var elem = document.createElement("div");
                elem.classList.add("person");
                wrapper.appendChild(elem);
            };
            fillElements();

        } else if (currentPersons.length > persons.length) {
            personsAmount = currentPersons.length - persons.length;

            for (var i = 0; i < personsAmount; i++) {
                wrapper.removeChild(currentPersons[i])
            };
            fillElements();
        };

        rightButton.addEventListener("click", moveForward);
        controlLeftBtn();
    }
};

// заполнение элементов
function fillElements(currentPersons) {
    currentPersons = document.querySelectorAll(".person");
    for (var i = 0; i < currentPersons.length; i++) {
        currentPersons[i].innerHTML = persons[i].name;
    }
};


function controlLeftBtn() {
    if (pageNumber === 1) {
        leftButton.removeEventListener("click", moveBack);
    } else {
        leftButton.addEventListener("click", moveBack);
    }
};

function moveBack() {
    pageNumber--;
    arrangeElements();
    leftButton.style.cssText = "border-right: 50px solid #ffbf7a;"
    setTimeout(function () { leftButton.style.cssText = "border-right: 50px solid #261503;" }, 200);
};

function moveForward() {
    pageNumber++;
    arrangeElements();
    rightButton.style.cssText = "border-left: 50px solid #ffbf7a;"
    setTimeout(function () { rightButton.style.cssText = "border-left: 50px solid #261503;" }, 200);
};

// получене выбранного объекта
function showDetails(event) {
    if (event.target.className === "person") {
        details.classList.add("visible");
        getData();
        var choosedPerson = event.target.innerHTML;
        for (var i = 0; i < persons.length; i++) {
            if (persons[i].name === choosedPerson) {
                choosedPerson = persons[i];
                fillTable.call(choosedPerson)
                break
            }
        }
    }
};

// заполнение таблицы
function fillTable() {
    tableName.innerHTML = this.name;
    tableDate.innerHTML = this.birth_year;
    tableGender.innerHTML = this.gender;
    tablePlanet.innerHTML = getDetails(this.homeworld).name
    forDetails(this.films, listOfMovies, "title");
    forDetails(this.species, tableSpecies, "name");
};

// обработка данных для таблицы
function forDetails(personInformation, destination, key) {
    destination.innerHTML = "";
    for (var i = 0; i < personInformation.length; i++) {
        var details = getDetails(personInformation[i]);
        if (key === "title") {
            destination.insertAdjacentHTML("beforeEnd", "<li>" + details.title + "</li>");
        } else {
            destination.innerHTML = details.name;
        }
    }
};

// запрос на получение деталей
function getDetails(url) {
    url = url.replace(/http/i, "https")
    var details;
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, false);

    xhr.onload = function () {
        details = JSON.parse(xhr.response);
    };

    xhr.send();
    return details
};

function hideDetails() {
    details.classList.remove("visible");
}