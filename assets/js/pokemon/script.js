import { renderPokemonList, showLoading } from "../ui/pokemon/script.js";
import { ptBRDictionary } from "../i18n/pt-BR.js";
import { capitalize } from "../utils.js";
import {
  handleTogglePaginationVisibility,
  handleUpdateActivePage,
  handleUpdatePaginationItems,
} from "./pagination.js";
import { enDictionary } from "../i18n/en.js";

const getPokemons = async (offset = 0, limit = 18) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok)
      throw new Error(`Erro HTTP ${response.status} ao buscar os pokémons`);

    const data = await response.json();

    return {
      data: data.results,
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Erro ao buscar os pokémons: ", error);

    return {
      data: [],
      count: 0,
    };
  }
};

const getPokemon = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok)
      throw new Error(
        `Erro HTTP ${response.status} ao buscar os dados do pokémon`
      );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar o pokémon: ", error);

    return null;
  }
};

const formatPokemonData = (pokemonData) => {
  const pokemonType = pokemonData?.types?.[0]?.type?.name;
  const pokemonName = pokemonData?.name;

  return {
    type: {
      rawName: pokemonType || "-",
      name: ptBRDictionary.pokemons.types[pokemonType] || pokemonType || "-",
    },
    name: capitalize(pokemonName) || "-",
    code: `#${String(pokemonData?.id).padStart(4, "0")}`,
    image: pokemonData?.sprites?.front_default || "assets/img/not-found.png",
  };
};

export const getCompletePokemonData = async (currentPage = 1, limit = 18) => {
  try {
    const { data: pokemons, count } = await getPokemons(
      (currentPage - 1) * limit,
      limit
    );

    const completeData = await Promise.all(
      pokemons.map(async (pokemon) => {
        const pokemonData = await getPokemon(pokemon.name);

        if (!pokemonData) return null;

        return formatPokemonData(pokemonData);
      })
    );

    return {
      data: completeData.filter(Boolean),
      totalPerPage: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error(
      "Ocorreu um erro ao gerar os dados completos dos pokemons: ",
      error
    );

    return {
      data: [],
      totalPerPage: 0,
    };
  }
};

const handleEmptySearch = async () => {
  const { data: pokemons, totalPerPage } = await getCompletePokemonData();

  handleUpdatePaginationItems(totalPerPage);
  handleUpdateActivePage(1);
  renderPokemonList(pokemons);
};

export const handleGetPaginationActivePage = () => {
  return (
    Number(document.querySelector(".pagination__item--active")?.textContent) ||
    1
  );
};

const handleSearchPokemon = async (id) => {
  const pokemonData = await getPokemon(id);

  if (!pokemonData) {
    renderPokemonList([]);
    handleUpdatePaginationItems(1, 1);
    handleUpdateActivePage(1);
    return;
  }

  const formattedPokemon = formatPokemonData(pokemonData);
  renderPokemonList([formattedPokemon]);
  handleUpdatePaginationItems(1, 1);
  handleUpdateActivePage(1);
};

const handleSubmitSearch = async (event) => {
  event.preventDefault();

  showLoading();
  handleTogglePaginationVisibility(true);

  const pokemonInput = document.querySelector(".pokemon-search__input")?.value;
  const lowerInput = (pokemonInput || "").trim().toLowerCase();
  const pokemonId = enDictionary.pokemons.names[lowerInput] || lowerInput;

  if (!pokemonId) {
    await handleEmptySearch();
    return;
  }

  await handleSearchPokemon(pokemonId.toLowerCase());
};

export const initSearchEvents = () => {
  const pokemonSearchForm = document.querySelector(".pokemon-search__form");

  pokemonSearchForm.addEventListener("submit", handleSubmitSearch);
};
