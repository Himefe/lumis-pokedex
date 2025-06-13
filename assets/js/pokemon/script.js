import { renderPokemonList, showLoading } from "../ui/pokemon/script.js";
import { ptBRPokemon } from "../i18n/pt-BR.js";
import { capitalize } from "../utils.js";

const getPokemons = async (offset = 0, limit = 18) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

        if (!response.ok) throw new Error("Ocorreu um erro ao buscar os pokémons");

        const data = await response.json();

        return data.results;
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

const getPokemonTypeColor = (type) => {
    const typeColors = {
        normal: "#A8A77A",
        fire: "#F26C38",
        water: "#4A90E2",
        grass: "#11B047",
        electric: "#F9D71C",
        ice: "#8DE0E0",
        fighting: "#D14234",
        poison: "#9B4E9E",
        ground: "#D7B75B",
        flying: "#A085F7",
        psychic: "#F7598C",
        bug: "#9CBC2F",
        rock: "#C2AB3C",
        ghost: "#6A4C8A",
        dragon: "#7451F9",
        dark: "#5B4A3E",
        steel: "#9EA2B8",
        fairy: "#E07DBE",
    };

    return typeColors[type] || "#777";
};

const formatPokemonData = (pokemonData) => {
    const pokemonType = pokemonData?.types[0]?.type?.name;
    const pokemonName = pokemonData?.name;

    return {
        type: {
            name: ptBRPokemon.types[pokemonType] || pokemonType || "-",
            color: getPokemonTypeColor(pokemonType),
        },
        name: capitalize(pokemonName) || "-",
        code: `#${String(pokemonData?.id).padStart(4, "0")}`,
        image: pokemonData?.sprites?.front_default,
    };
};

export const getCompletePokemonData = async (offset = 0, limit = 18) => {
    try {
        const pokemons = await getPokemons(offset, limit);
        const completeData = [];

        for (const pokemon of pokemons) {
            const pokemonData = await getPokemon(pokemon.name);

            const formattedPokemonData = formatPokemonData(pokemonData);

            completeData.push(formattedPokemonData);
        }

        return completeData;
    } catch (error) {
        console.log("Ocorreu um erro ao gerar os dados completos dos pokemons: ", error);

        return [];
    }
};

const handleSearchInput = async (event) => {
    event.preventDefault();

    showLoading();
    const pokemonSearchInput = document.querySelector(".pokemon-search__input");
    const pokemonData = await getPokemon(pokemonSearchInput.value.toLowerCase());

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
