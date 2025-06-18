import { ptBRDictionary } from "../../i18n/pt-BR.js";
import { handleTogglePaginationVisibility, handleUpdateActivePage, handleUpdatePaginationItems, MAX_LIMIT_PER_PAGE } from "../../pokemon/pagination.js";
import { getCompletePokemonData } from "../../pokemon/script.js";

export const showLoading = () => {
    const pokemonCards = document.querySelector(".pokemon-list__cards");
    pokemonCards.innerHTML = Array.from({ length: 18 }, () => `<li class=" pokemon-list__card pokemon-list__card--loading"></li>`).join("");
};

const generatePokemonCard = ({ name, code, image, type }) => {
    const pokemonName = ptBRDictionary.pokemons.names[name.toLowerCase()] || name;

    return `<li class="pokemon-list__card" data-raw-type="${type.rawName}">
                <div class="pokemon-list__card-details">
                    <span class="pokemon-list__card-type">${type.name}</span>
                    <span class="pokemon-list__card-number">${code}</span>
                </div>
                <div class="pokemon-list__card-image">
                    <img loading="lazy" width="152" height="152" src="${image}" alt="Esta imagem representa o pokemon ${pokemonName}." />
                </div>
                <strong class="pokemon-list__card-name">${pokemonName}</strong>
            </li>`;
};

export const loadAndRenderPokemonsByPage = async (page = 1, limit = MAX_LIMIT_PER_PAGE, searchName = "") => {
    try {
        showLoading();

        const { data: pokemons, totalPerPage } = await getCompletePokemonData(page, limit, searchName);

        renderPokemonList(pokemons);
        handleUpdateActivePage(page);
        handleUpdatePaginationItems(totalPerPage);
    } catch (error) {
        console.error("Ocorreu um erro ao renderizar os pokemons", error);
    }
};

export const renderEmptyMessage = () => {
    const pokemonCards = document.querySelector(".pokemon-list__cards");
    pokemonCards.innerHTML = `<li class="pokemon-list__empty">Nenhum pokémon encontrado.</li>`;
};

export const renderPokemonList = (pokemons = []) => {
    const pokemonCards = document.querySelector(".pokemon-list__cards");

    if (!pokemons.length) {
        renderEmptyMessage();
        handleTogglePaginationVisibility(true);
        return;
    }

    pokemonCards.innerHTML = pokemons.map(generatePokemonCard).join("");

    if (pokemons.length > 1) {
        handleTogglePaginationVisibility(false);
    }
};
