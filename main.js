"use strict";

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

/* generates a random number based on range given */
const getRandomNumber = function(range) {
	return Math.ceil(Math.random() * range);
} 
/*setting global var counter at 1 to create a switch/case stack for input function*/
let counter = 1;
/*getting all pokemon names in an array*/
let allPokemonNames = [];
let score = 20;
let highscore = 0;
let hardModeOn = false;
/*viewport adjustment for keyboard issue on andoid*/
let initialHeight = window.innerHeight;
let initialWidth = window.innerWidth;

/*creating empty object to fill with data from api*/
let pokemon = {
};

const reset = function (isSoftReset = false) {
	document.querySelector(".pokemonImage")?.remove();
	const pokemonId = hardModeOn ? getRandomNumber(251) : getRandomNumber(150);
	counter = 1;
	list.innerHTML = "";
	getPokemon(pokemonId)
	.then((response) => {
		getPokemonInfo(response);
	})
	.catch(err => {
		console.log(err);
	});
	if (!isSoftReset) {
		highscore = 0;
	} else {
		highscore = highscore < score ? score : highscore; 
	}
	score = hardModeOn ? 40 : 20;
	scoreEl.lastElementChild.innerText = score;
	highScoreEl.lastElementChild.innerText = highscore;
	bodyBackground.style.display = "none";
	popup.style.display = "none";
	inputName.value = "";
	infoSide.innerHTML = "";
}

/*creating a start state for reset button*/
const startState = function () {
	getAllPokemon()
	.then(() => {
		reset();
	})
	.catch(err => {
		console.log(err);
	})
	checkBtn.addEventListener("click", getInput);
	resetBtn.addEventListener("click", () => {reset(true)});
	infoBtn.addEventListener("click", () => (infoCont.style.display = "block"));
	closeBtn.addEventListener("click", () => (infoCont.style.display = "none"));
	hardBtn.addEventListener("click", modeSelect);
	normalBtn.addEventListener("click", modeSelect);
};

/* collecting data to store into pokemon object */
const getPokemon = async function (pokemonId) {
	try {
		load.classList.toggle("hide");
		const response = await axios.get(
			`https://pokeapi.co/api/v2/pokemon/${pokemonId}`
		);
		load.classList.toggle("hide");
		const data = response.data;
		return data;
	} catch (err) {
		throw err;
	}
};

/*retrieving data from api to push into 
allPokemonNames array*/
const getAllPokemon = async function () {
	try {
		load.classList.toggle("hide");
		const response = await axios.get(
			`https://pokeapi.co/api/v2/pokemon?limit=251`
		);
		load.classList.toggle("hide");
		allPokemonNames = response.data.results.map((obj) => {
			return obj.name;
		})
	} catch (err) {
		throw err;
	}
};

/*hard mode function*/
const modeSelect = function () { 
	hardModeOn = !hardModeOn;
	score = hardModeOn ? 40 : 20;
	reset();
	hardBtn.classList.toggle("hide");
	normalBtn.classList.toggle("hide");
};

/*creating list items to add to unordered list dynamically*/
const createListItems = function (sortedPokemon) {
	for (let pokemonName of sortedPokemon) {
		const p = document.createElement("p");
		p.classList.add("createdListItem");
		p.innerText = pokemonName;
		list.appendChild(p);
	}
};

const getSelectedPokemon = function (hardModeOn) {
	const pokemonAmount = hardModeOn ? 251 : 151;
	const selectedPokemon = [];
	for (let i = 0; i < pokemonAmount; i++) {
		selectedPokemon.push(allPokemonNames[i]);
	}
	return selectedPokemon.sort();
};

/* creating a div with whatever item i want in it */
const createDiv = function (value, objPos) {
	const div = document.createElement("div");
	div.classList.add("createdDiv");
	div.innerHTML = `<p>${value} : ${objPos}</p>`;
	infoSide.appendChild(div);
};

/* creating an image of pokemon stored in object */
const createImg = function (ev) {
	const img = document.createElement("img");
	img.setAttribute("src", pokemon.image);
	img.classList.add("pokemonImage");
	document.querySelector(".pokemonImageContainer").appendChild(img);
};

/* storing data from api into pokemon object */
const getPokemonInfo = function (data) {
	pokemon.name = data.name;
	pokemon.pokedexNumber = data.id;
	pokemon.image = data.sprites.front_default;
	pokemon.weight = data.weight.toString().slice(0, -1);
	pokemon.type = data.types.map((type) => {
		return type.type.name;
	});
	pokemon.abilities = data.abilities.map((ability) => {
		return ability.ability.name;
	});
	pokemon.moves = data.moves.map((move) => {
		return move.move.name;
	});
	createDiv("primary type", pokemon.type[0]);
	const selectedPokemon = getSelectedPokemon(hardModeOn);
	createListItems(selectedPokemon);
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
						pokemon.moves[getRandomNumber(pokemon.moves.length) - 1]
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
						pokemon.moves[getRandomNumber(pokemon.moves.length) - 1]
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
						createDiv("region", pokemon.pokedexNumber <= 151 ? "kanto" : "johto");
						break;
					} else {
						counter++;
					}
				case 8:
					createDiv(
						"ends with",
						pokemon.name.charAt(pokemon.name.length - 1)
					);
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
						pokemon.moves[getRandomNumber(pokemon.moves.length) - 1]
					);
					break;
				case 12:
					createDiv("starts with", pokemon.name.charAt(0));
					break;
			}
			counter++;
			score--;
			scoreEl.lastElementChild.innerText = score;
			inputName.value = "";
		}
	} else {
		alert(`Please write a valid pokemon name from ${hardModeOn ? 'Kanto and Johto combined' : 'the original 150'}`);
	}
};

startState();

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
		(window.innerHeight < initialHeight &&
			window.innerWidth > initialWidth) ||
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
