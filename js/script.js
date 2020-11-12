"use strict"

const wrapper = document.querySelector(".wrapper");
const leftButton = document.querySelector(".triangle-left");
const rightButton = document.querySelector(".triangle-right");
const closeButton = document.querySelector(".close-btn");
const details = document.querySelector(".container-details");
const tableName = document.querySelector(".name");
const tableDate = document.querySelector(".date");
const tableGender = document.querySelector(".gender");
const tableMovies = document.querySelector(".movies");
const tablePlanet = document.querySelector(".planet");
const tableSpecies = document.querySelector(".species");

let pageNumber = 1;
let currentPersons;
let status;

window.addEventListener("load", showElements);
wrapper.addEventListener("click", showDetails);
closeButton.addEventListener("click", hideDetails);
details.addEventListener("click", hideDetails);

async function getData() {
    let url = "https://swapi.dev/api/people/?page=" + pageNumber;
    try {
        const reqest = await fetch(url);
        status = reqest.status;
        if (status >= 400) {
            throw new Error()
        }
        const response = await reqest.json();
        const data = await response.results;
        return data
    } catch {
        rightButton.removeEventListener("click", moveForward);
        pageNumber--;
    }
};

function arrangeElements(persons) {
    rightButton.addEventListener("click", moveForward);
    controlLeftBtn();

    currentPersons = document.querySelectorAll(".person");
    let personsAmount;

    if (currentPersons.length === persons.length) {
        return
    } else if (currentPersons.length < persons.length) {
        personsAmount = persons.length - currentPersons.length;

        for (let i = 0; i < personsAmount; i++) {
            const elem = document.createElement("div");
            elem.classList.add("person");
            wrapper.appendChild(elem);
        };

    } else if (currentPersons.length > persons.length) {
        personsAmount = currentPersons.length - persons.length;

        for (let i = 0; i < personsAmount; i++) {
            wrapper.removeChild(currentPersons[i])
        };
    }
};

function fillElements(persons) {
    currentPersons = document.querySelectorAll(".person");
    for (let i = 0; i < currentPersons.length; i++) {
        currentPersons[i].innerHTML = persons[i].name;
    }
};

function moveBack() {
    pageNumber--;
    showElements();
    leftButton.style.cssText = "border-right: 50px solid #ffbf7a;"
    setTimeout(function () { leftButton.style.cssText = "border-right: 50px solid #261503;" }, 200);
};

function moveForward() {
    pageNumber++;
    showElements();
    rightButton.style.cssText = "border-left: 50px solid #ffbf7a;"
    setTimeout(function () { rightButton.style.cssText = "border-left: 50px solid #261503;" }, 200);
};

function controlLeftBtn() {
    if (pageNumber === 1) {
        leftButton.removeEventListener("click", moveBack);
    } else {
        leftButton.addEventListener("click", moveBack);
    }
};

function showElements() {
    getData()
        .then(function (persons) {
            if (status >= 400) {
                return
            };

            arrangeElements(persons);
            return persons
        })
        .then(function (persons) {
            if (status >= 400) {
                return
            };

            fillElements(persons);
        });
};

function showDetails(event) {
    if (event.target.className === "person") {
        getData()
            .then(function (persons) {
                let choosedPerson = event.target.innerHTML;
                for (let i = 0; i < persons.length; i++) {
                    if (persons[i].name === choosedPerson) {
                        choosedPerson = persons[i];
                        fillTable.call(choosedPerson)
                        break
                    }
                }
            })

    }
};

function fillTable() {
    tableName.innerHTML = this.name;
    tableDate.innerHTML = this.birth_year;
    tableGender.innerHTML = this.gender;
    forDetails([this.homeworld], tablePlanet, "name");
    forDetails(this.films, tableMovies, "title");
    forDetails(this.species, tableSpecies, "name");

    details.classList.add("visible");
    disableScroll();
};

function forDetails(personInformation, destination, key) {
    destination.innerHTML = "";

    if (personInformation.length === 0) {
        destination.innerHTML = "n/a";
    };

    for (let i = 0; i < personInformation.length; i++) {
        if (key === "title") {
            getDetails(personInformation[i]).then(function (data) {
                destination.insertAdjacentHTML("beforeEnd", "<li>" + data.title + "</li>");
            });
        } else {
            getDetails(personInformation[i]).then(function (data) {
                destination.innerHTML = data.name;
            });
        }
    }
};

async function getDetails(url) {
    url = url.replace(/http/i, "https")

    const reqest = await fetch(url);
    const response = await reqest.json();
    return response
};

function hideDetails() {
    details.classList.remove("visible");
    enableScroll();
};