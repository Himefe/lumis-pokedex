import { renderPokemonList, showLoading } from "../ui/pokemon/script.js";
import { ptBRPokemon } from "../i18n/pt-BR.js";
import { capitalize } from "../utils.js";
import { handleTogglePaginationVisibility } from "./pagination.js";

const getPokemons = async (offset = 0, limit = 18) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

        if (!response.ok) throw new Error("Ocorreu um erro ao buscar os pokémons");

        const data = await response.json();

        return {
            data: data.results,
            count: data.count || 0,
        };
    } catch (error) {
        console.error("Ocorreu um erro ao buscar os pokémons:", error);
    }
};

const getPokemon = async (id) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

        if (!response.ok) throw new Error("Ocorreu um erro ao buscar o pokemon");

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Ocorreu um erro ao buscar a especie do pokémon:", error);
    }
};

const formatPokemonData = (pokemonData) => {
    const pokemonType = pokemonData?.types?.[0]?.type?.name;
    const pokemonName = pokemonData?.name;

    return {
        type: {
            rawName: pokemonType || "-",
            name: ptBRPokemon.types[pokemonType] || pokemonType || "-",
        },
        name: capitalize(pokemonName) || "-",
        code: `#${String(pokemonData?.id).padStart(4, "0")}`,
        image: pokemonData?.sprites?.front_default,
    };
};

export const getCompletePokemonData = async (currentPage = 1, limit = 18) => {
    try {
        const { data: pokemons, count } = await getPokemons((currentPage - 1) * limit, limit);
        const completeData = [];

        for (const pokemon of pokemons) {
            const pokemonData = await getPokemon(pokemon.name);

            const formattedPokemonData = formatPokemonData(pokemonData);

            completeData.push(formattedPokemonData);
        }

        return {
            data: completeData,
            totalPerPage: Math.ceil(count / limit),
        };
    } catch (error) {
        console.error("Ocorreu um erro ao gerar os dados completos dos pokemons: ", error);

        return {
            data: [],
            totalPerPage: 0,
        };
    }
};

const handleSearchInput = async (event) => {
    event.preventDefault();

    showLoading();
    handleTogglePaginationVisibility(true);

    const pokemonSearchInput = document.querySelector(".pokemon-search__input");
    const pokemonSearchInputValue = pokemonSearchInput?.value?.trim()?.toLowerCase();

    if (!pokemonSearchInputValue) {
        const { data: pokemons } = await getCompletePokemonData();

        renderPokemonList(pokemons);
        return;
    }

    const pokemonData = await getPokemon(pokemonSearchInputValue);

    if (!pokemonData) {
        renderPokemonList([]);
        return;
    }

    const formattedPokemonData = formatPokemonData(pokemonData);

    renderPokemonList([formattedPokemonData]);
};

export const initSearchEvents = () => {
    const pokemonSearchForm = document.querySelector(".pokemon-search__form");

    pokemonSearchForm.addEventListener("submit", handleSearchInput);
};
