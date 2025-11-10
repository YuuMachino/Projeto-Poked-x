const container = document.getElementById('card-container');

async function fetchPokemonData(id) {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  ]);

  const pokemon = await pokemonRes.json();
  const species = await speciesRes.json();

  const descriptionEntry = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );

  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default,
    types: pokemon.types.map(t => t.type.name),
    description: descriptionEntry ? descriptionEntry.flavor_text.replace(/\f/g, ' ') : 'No description available.'
  };
}

function createCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}" />
    <h2>#${pokemon.id.toString().padStart(3, '0')} - ${pokemon.name.toUpperCase()}</h2>
    <p>Tipo: ${pokemon.types.join(', ')}</p>
    <button class="toggle-btn">🔍 Ver mais</button>
    <div class="description hidden">
      <p>${pokemon.description}</p>
    </div>
  `;

  const button = card.querySelector('.toggle-btn');
  const desc = card.querySelector('.description');

  button.addEventListener('click', () => {
    desc.classList.toggle('hidden');
    button.textContent = desc.classList.contains('hidden') ? '🔍 Ver mais' : '❌ Ocultar';
  });

  container.appendChild(card);
}

document.getElementById('power-btn').addEventListener('click', () => {
  const startup = document.getElementById('startup-screen');
  const pokedex = document.querySelector('.pokedex');

  startup.style.opacity = '0';
  setTimeout(() => {
    startup.classList.add('hidden');
    pokedex.classList.remove('hidden');
  }, 1000);
});

async function loadAllPokemon() {
  const promises = [];
  for (let i = 1; i <= 151; i++) {
    promises.push(fetchPokemonData(i));
  }

  const allPokemon = await Promise.all(promises);
  allPokemon.sort((a, b) => a.id - b.id);
  allPokemon.forEach(createCard);
}

loadAllPokemon();
