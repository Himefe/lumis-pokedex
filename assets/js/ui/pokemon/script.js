export const showLoading = () => {
    const loadingEl = `<li class="pokemon-list__loading">Carregando...</li>`;
    const pokemonCards = document.querySelector(".pokemon-list__cards");
    pokemonCards.innerHTML = "";

    pokemonCards.insertAdjacentHTML("beforeend", loadingEl);
};

const generatePokemonCard = ({ name, code, image, type }) => {
    return `<li class="pokemon-list__card">
                <div class="pokemon-list__card-details">
                    <span style="color: ${type.color}" class="pokemon-list__card-type">${type.name}</span>
                    <span class="pokemon-list__card-number">${code}</span>
                </div>
                <div class="pokemon-list__card-image">
                    <img width="152" height="152" src="${image}" alt="Esta imagem representa o pokemon ${name}." />
                </div>
                <strong class="pokemon-list__card-name">${name}</strong>
            </li>`;
};

export const renderPokemonList = (pokemons) => {
    const pokemonCards = document.querySelector(".pokemon-list__cards");

    if (!pokemons?.length) {
        pokemonCards.innerHTML = `<li class="pokemon-list__empty">Nenhum pokémon encontrado.</li>`;
        return;
    }

    pokemonCards.innerHTML = pokemons.map(generatePokemonCard).join("");
};
