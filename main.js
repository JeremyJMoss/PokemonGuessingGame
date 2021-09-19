"use strict";

/*storing data recieved from api in data*/
let data;
/*generates a random number based on range given*/
let randomNumber = (range) => Math.ceil(Math.random() * range);
/*storing random pokemon chosen in pokemonId*/
let pokemonId = randomNumber(150);
/*setting global var counter at 1 to create a switch/case stack for input function*/
let counter = 1;
/*getting all pokemon names in an array*/
let allPokemonNames = [];
let score = 20;
let highscore = 0;
let sortedPokemon;
let hardModeOn = false;
let p;
let selectedPokemon = [];
/*viewport adjustment for keyboard issue on andoid*/
let initialHeight = window.innerHeight;
let initialWidth = window.innerWidth;

/*collecting items for manipulation from Dom*/
const checkBtn = document.getElementById("check");
const questionMark = document.getElementById("questionMark");
const inputName = document.getElementById("nameInput");
const infoSide = document.querySelector(".infoSide");
const highScoreEl = document.querySelector(".highScore");
const scoreEl = document.querySelector(".score");
const bodyBackground = document.querySelector(".backgroundPopup");
const popup = document.querySelector(".popUpWindow");
const resetBtn = document.querySelector(".resetBtn");
const infoBtn = document.getElementById("informationButton");
const infoCont = document.querySelector(".pokemonInfo");
const closeBtn = document.getElementById("closeBtn");
const list = document.getElementById("pokemonList");
const hardBtn = document.getElementById("hardBtn");
const normalBtn = document.getElementById("normalBtn");
const load = document.querySelector(".loadPage");
const metaViewport = document.querySelector("meta[name=viewport]");

/*creating empty object to fill with data from api*/
let pokemon = {
  type: [],
  abilities: [],
  moves: [],
};

/*creating a start state for reset button*/
const startState = function () {
  loadPage();
  document.querySelector(".pokemonImage").remove();
  hardModeOn
    ? (pokemonId = randomNumber(251))
    : (pokemonId = randomNumber(150));
  counter = 1;
  pokemon.type = [];
  pokemon.abilities = [];
  pokemon.moves = [];
  list.innerHTML = "";
  getPokemon();
  getInfo();
  if (highscore < score) {
    highScoreEl.lastElementChild.innerText = highscore = score;
  }
  hardModeOn ? (score = 40) : (score = 20);
  scoreEl.lastElementChild.innerText = score;
  bodyBackground.style.display = "none";
  popup.style.display = "none";
  inputName.value = "";
  infoSide.innerHTML = "";
};

/*collecting data to store into pokemon object*/
const getPokemon = function () {
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log("whoops something didn't work"));
};

/*retrieving data from api to push into 
allPokemonNames array*/
const getAllPokemon = function () {
  axios
    .get(`https://pokeapi.co/api/v2/pokemon?limit=251`)
    .then((response) => {
      return response.data;
    })
    .then((r) => {
      return r.results;
    })
    .then((a) => {
      for (let obj in a) {
        allPokemonNames.push(a[obj].name);
      }
    })
    .catch((err) => console.log("whoops something didn't work"));
};

/*hard mode function*/
const modeSelect = function () {
  loadPage();
  if (hardModeOn) {
    hardModeOn = false;
    pokemonId = randomNumber(151);
  } else {
    hardModeOn = true;
    pokemonId = randomNumber(251);
  }
  counter = 1;
  pokemon.type = [];
  pokemon.abilities = [];
  pokemon.moves = [];
  list.innerHTML = "";
  getPokemon();
  getInfo();
  highscore = 0;
  score != 40 ? (score = 40) : (score = 20);
  highScoreEl.lastElementChild.innerText = highscore;
  scoreEl.lastElementChild.innerText = score;
  inputName.value = "";
  infoSide.innerHTML = "";
  hardBtn.classList.toggle("hide");
  normalBtn.classList.toggle("hide");
};

/*loading page to stop unwanted click events before api request has been made*/
const loadPage = function () {
  load.classList.toggle("hide");
  setTimeout(function () {
    load.classList.toggle("hide");
  }, 2000);
};
/*creating list items to add to unordered list dynamically*/
const createListItems = function () {
  if (hardModeOn) {
    for (let item of sortedPokemon) {
      p = document.createElement("p");
      p.classList.add("createdListItem");
      p.innerText = item;
      list.appendChild(p);
    }
  } else {
    for (let i = 0; i < 151; i++) {
      p = document.createElement("p");
      p.classList.add("createdListItem");
      p.innerText = sortedPokemon[i];
      list.appendChild(p);
    }
  }
};

const selectedAm = function (value) {
  for (let i = 0; i < value; i++) {
    selectedPokemon.push(allPokemonNames[i]);
  }
};

/*creating a div with whatever item i want in it*/
const createDiv = function (value, objPos) {
  const div = document.createElement("div");
  div.classList.add("createdDiv");
  div.innerHTML = `<p>${value} : ${objPos}</p>`;
  infoSide.appendChild(div);
};

/*creating an image of pokemon stored in object*/
const createImg = function (ev) {
  const img = document.createElement("img");
  img.setAttribute("src", pokemon.image);
  img.classList.add("pokemonImage");
  document.querySelector(".pokemonImageContainer").appendChild(img);
};

/*storing data from api into pokemon object*/
const getInfo = function () {
  setTimeout(function () {
    pokemon.name = data.name;
    pokemon.pokedexNumber = data.id;
    pokemon.image = data.sprites.front_default;
    pokemon.weight = data.weight.toString().slice(0, -1);
    selectedPokemon = [];
    hardModeOn ? selectedAm(251) : selectedAm(151);
    sortedPokemon = selectedPokemon.sort();
    createListItems();
    for (let i = 0; i < data.types.length; i++) {
      pokemon.type.push(data.types[i].type.name);
    }
    for (let i = 0; i < data.abilities.length; i++) {
      pokemon.abilities.push(data.abilities[i].ability.name);
    }
    for (let i = 0; i < data.moves.length; i++) {
      pokemon.moves.push(data.moves[i].move.name);
    }
    createDiv("primary type", pokemon.type[0]);
  }, 2000);
};

/*creating a function to attach to event listener for checkBtn click*/
const getInput = function (ev) {
  ev.preventDefault();
  if (allPokemonNames.includes(inputName.value.toLowerCase())) {
    if (inputName.value.toLowerCase() === pokemon.name) {
      createImg();
      bodyBackground.style.display = "block";
      popup.style.display = "flex";
    } else {
      switch (counter) {
        case 1:
          createDiv("first ability", pokemon.abilities[0]);
          break;
        case 2:
          createDiv(
            "learnable move",
            pokemon.moves[randomNumber(pokemon.moves.length) - 1]
          );
          break;
        case 3:
          if (pokemon.abilities[1]) {
            createDiv("second ability", pokemon.abilities[1]);
            break;
          } else {
            counter++;
          }
        case 4:
          createDiv(
            "learnable move",
            pokemon.moves[randomNumber(pokemon.moves.length) - 1]
          );
          break;
        case 5:
          if (pokemon.type[1]) {
            createDiv("secondary type", pokemon.type[1]);
            break;
          } else {
            counter++;
          }
        case 6:
          if (pokemon.abilities[2]) {
            createDiv("third ability", pokemon.abilities[2]);
            break;
          } else {
            counter++;
          }
        case 7:
          if (hardModeOn) {
            pokemon.pokedexNumber <= 151
              ? createDiv("region", "kanto")
              : createDiv("region", "johto");
            break;
          } else {
            counter++;
          }
        case 8:
          createDiv("ends with", pokemon.name.charAt(pokemon.name.length - 1));
          break;
        case 9:
          createDiv("weight", `${pokemon.weight} Kg`);
          break;
        case 10:
          createDiv("pokedex no.", pokemon.pokedexNumber);
          break;
        case 11:
          createDiv(
            "learnable move",
            pokemon.moves[randomNumber(pokemon.moves.length) - 1]
          );
          break;
        case 12:
          createDiv("starts with", pokemon.name.charAt(0));
      }
      counter++;
      score -= 1;
      scoreEl.lastElementChild.innerText = score;
      inputName.value = "";
    }
  } else {
    hardModeOn
      ? alert(`Please write a valid pokemon name from Kanto and Johto combined`)
      : alert(`Please write a valid pokemon name
    from the original 150`);
  }
};

scoreEl.lastElementChild.innerText = score;
highScoreEl.lastElementChild.innerText = highscore;

loadPage();
getAllPokemon();
getPokemon();
getInfo();

checkBtn.addEventListener("click", getInput);
resetBtn.addEventListener("click", startState);
infoBtn.addEventListener("click", () => (infoCont.style.display = "block"));
closeBtn.addEventListener("click", () => (infoCont.style.display = "none"));
hardBtn.addEventListener("click", modeSelect);
normalBtn.addEventListener("click", modeSelect);

/*adjusting for mobile view resize for landscape and input field where keyboard comes in and ruins your day*/
window.onresize = function () {
  if (
    window.innerHeight < initialHeight &&
    window.innerWidth === initialWidth
  ) {
    document.documentElement.style.setProperty("overflow", "auto");
    metaViewport.setAttribute(
      "content",
      `height=${initialHeight}, width=${initialWidth}, initial-scale=1.0 maximum-scale=1.0, user-scalable=0`
    );
  } else if (
    (window.innerHeight < initialHeight && window.innerWidth > initialWidth) ||
    (window.innerHeight > initialHeight && window.innerWidth < initialWidth)
  ) {
    initialHeight = window.innerHeight;
    initialWidth = window.innerWidth;
    document.documentElement.style.setProperty("overflow", "auto");
    metaViewport.setAttribute(
      "content",
      `width=${initialWidth}, height=${initialHeight}, initial-scale=1.0, maximum-scale=1.0 user-scalable=0`
    );
  }
};
