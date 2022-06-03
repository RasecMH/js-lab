const answersButtons = Array.from(document.getElementsByClassName('answer-button'));
const pokemonImg = document.getElementsByClassName('pokemon-image')[0];
const questionContainer = document.getElementsByClassName('question-container')[0];
const score = document.getElementsByClassName('score')[0];
const question = document.getElementsByClassName('question')[0];
const select = document.getElementsByClassName('select-gen')[0];

let rightAnswer = '';
let scoreCount = 0;

const fetchSinglePokemonData = async (PokemonName) => {
  const fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${PokemonName}`);
  const pokemonObject = await fetchPokemon.json();
  // console.log(pokemonObject);
  return pokemonObject;
};

const fetchPokemonDataByGeneration = async (GenId) => {
  const fetchGeneration = await fetch(`https://pokeapi.co/api/v2/generation/${GenId}`);
  const pokemonGenerationObject = await fetchGeneration.json();
  // console.log(pokemonGenerationObject.pokemon_species);
  return pokemonGenerationObject.pokemon_species;
};

const fetchAllPokemonData = async () => {
  const fetchAllPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=898&offset=0`);
  const allPokemonObject = await fetchAllPokemon.json();
  // console.log(pokemonSizeObject.results);
  return allPokemonObject.results;
};

const generateRandomArrayNumbers = () => {
  const arr = [];
  while(arr.length < 4){
      let r = Math.floor(Math.random() * 4);
      if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

const shufflePokemonData = async (callback, id) => {
//  console.log(id);
 const pokemonObj = await callback(id);
 const shuffledPokemons = pokemonObj.sort(() => Math.random() - 0.5);
 const selectedPokemon = [
 shuffledPokemons[0],
 shuffledPokemons[1],
 shuffledPokemons[2],
 shuffledPokemons[3]
];
//  console.log(selectedPokemon);
 return selectedPokemon;
};

const handleClick = (e) => {
  const clickValue = e.target.textContent;
  console.log(clickValue);
  if(clickValue == rightAnswer) {
    alert('você acertou!');
    scoreCount += 1;
    return randomStart(select.value);

  }
  alert('você errou!')
  randomStart(select.value);

};

const setupQuestion = async (callback, genId) => {
  const pokemons = await shufflePokemonData(callback, genId);
  const rightPokemon = await fetchSinglePokemonData(pokemons[0].name);
  console.log(rightPokemon);
  const displayAnswers = generateRandomArrayNumbers();
  const pokemonsData = await Promise.all(
    pokemons.map(async (pokemon) => {
      const atualPokemon = await fetchSinglePokemonData(pokemon.name);
      return atualPokemon;
    }));
  const idPokemons = pokemonsData.map(pokemon => pokemon.id);
  const pokemonsType = pokemonsData.map(pokemon => {
    return pokemon.types.map(poke => poke.type.name).join('/');
  });
  console.log(pokemonsType);
  score.textContent = `Score: ${scoreCount}`

  return {pokemons, rightPokemon, displayAnswers, idPokemons, pokemonsType };
}

const nameQuestion = async (setup) => {
  const { pokemons, rightPokemon, displayAnswers } = setup;
  rightAnswer = pokemons[0].name;
  question.textContent = 'Qual o nome desse pokemon?';
  answersButtons.forEach((btn, index) => {
    btn.addEventListener('click', handleClick)
    btn.textContent = pokemons[displayAnswers[index]].name;
  });
  pokemonImg.src = rightPokemon.sprites.other['official-artwork'].front_default;
  console.log(rightAnswer);
};

const idQuestion = async (setup) => {
  const { rightPokemon, displayAnswers, idPokemons } = setup;
  question.textContent = 'Qual o ID desse pokemon?';
  rightAnswer = idPokemons[0];
  answersButtons.forEach((btn, index) => {
    btn.addEventListener('click', handleClick)
    btn.textContent = `${idPokemons[displayAnswers[index]]}`;
  });
  pokemonImg.src = rightPokemon.sprites.other['official-artwork'].front_default;
  console.log(rightAnswer);
};

const typeQuestion = async (setup) => {
  const { rightPokemon, displayAnswers, pokemonsType } = setup;
  question.textContent = 'Qual o TIPO desse pokemon?';
  rightAnswer = pokemonsType[0];
  answersButtons.forEach((btn, index) => {
    btn.addEventListener('click', handleClick)
    btn.textContent = `${pokemonsType[displayAnswers[index]]}`;
  });
  pokemonImg.src = rightPokemon.sprites.other['official-artwork'].front_default;
  console.log(rightAnswer);
};

const randomStart = async (genInfo) => {
  console.log(genInfo);
  let questionObj = await setupQuestion(fetchAllPokemonData);
  if(genInfo !== 'all-gens') {
    questionObj = await setupQuestion(fetchPokemonDataByGeneration, genInfo);
  }
  const randomizeQuestion = Math.floor(Math.random() * 3);
  console.log(randomizeQuestion);
  switch (randomizeQuestion) {
    case 0:
      nameQuestion(questionObj);
      break;
    case 1:
      idQuestion(questionObj);
      break;
    case 2:
      typeQuestion(questionObj);
      break;
  }
};

select.addEventListener('change', () => {
  randomStart(select.value);
});

randomStart(select.value);
