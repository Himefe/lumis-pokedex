import { handleTogglePaginationVisibility } from "../../pokemon/pagination.js";
import { getCompletePokemonData } from "../../pokemon/script.js";

export const showLoading = () => {
    const loadingEl = `<li class="pokemon-list__loading">Carregando...</li>`;
    const pokemonCards = document.querySelector(".pokemon-list__cards");
    pokemonCards.innerHTML = "";

    pokemonCards.insertAdjacentHTML("beforeend", loadingEl);
};

const generatePokemonCard = ({ name, code, image, type }) => {
    return `<li class="pokemon-list__card" data-raw-type="${type.rawName}">
                <div class="pokemon-list__card-details">
                    <span class="pokemon-list__card-type">${type.name}</span>
                    <span class="pokemon-list__card-number">${code}</span>
                </div>
                <div class="pokemon-list__card-image">
                    <img width="152" height="152" src="${image}" alt="Esta imagem representa o pokemon ${name}." />
                </div>
                <strong class="pokemon-list__card-name">${name}</strong>
            </li>`;
};

export const loadAndRenderPokemonsByPage = async (page = 1, limit = 18) => {
    showLoading();
    handleTogglePaginationVisibility(true);

    const { data: pokemons, totalPerPage } = await getCompletePokemonData(page, limit);
    renderPokemonList(pokemons);

    return { totalPerPage };
};

export const renderPokemonList = (pokemons) => {
    const pokemonCards = document.querySelector(".pokemon-list__cards");

    if (!pokemons?.length) {
        pokemonCards.innerHTML = `<li class="pokemon-list__empty">Nenhum pokémon encontrado.</li>`;
        handleTogglePaginationVisibility(true);
        return;
    }

    pokemonCards.innerHTML = pokemons.map(generatePokemonCard).join("");

    if (pokemons.length > 1) {
        handleTogglePaginationVisibility(false);
    }
};
