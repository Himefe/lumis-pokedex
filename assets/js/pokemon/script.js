import { loadAndRenderPokemonsByPage } from "../ui/pokemon/script.js";
import { ptBRDictionary } from "../i18n/pt-BR.js";
import { capitalize, normalizePokemonInput } from "../utils.js";
import { enDictionary } from "../i18n/en.js";
import { MAX_LIMIT_PER_PAGE } from "./pagination.js";

let pokemonsForSearchArr = [];

export const getPokemonsForSearch = () => {
    return pokemonsForSearchArr;
};

export const setPokemonsForSearch = (pokemons) => {
    pokemonsForSearchArr = pokemons;
};

export const getPokemons = async (offset = 0, limit = MAX_LIMIT_PER_PAGE) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

        if (!response.ok) throw new Error(`Erro HTTP ${response.status} ao buscar os pokémons`);

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

        if (!response.ok) throw new Error(`Erro HTTP ${response.status} ao buscar os dados do pokémon`);

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
        image: pokemonData?.sprites?.other?.["official-artwork"]?.front_default || "assets/img/not-found.png",
    };
};

export const getCompletePokemonData = async (currentPage = 1, limit = MAX_LIMIT_PER_PAGE, searchText = "") => {
    try {
        const offset = searchText ? 0 : (currentPage - 1) * limit;

        let pokemonsDataArr = [];
        let count;

        if (searchText) {
            const lowerSearch = searchText.toLowerCase();

            const possibleTranslations = Object.entries(enDictionary.pokemons.names).reduce((acc, [ptKeyName, enValue]) => {
                if (ptKeyName.includes(lowerSearch)) {
                    acc.push(enValue.toLowerCase());
                }

                return acc;
            }, []);

            const filteredPokemons = getPokemonsForSearch().filter(({ name, url = "" }) => {
                const lowerName = name.toLowerCase();
                const id = url.match(/\d+(?=\/?$)/)[0];

                const hasTranslatedMatch = possibleTranslations.some((enName) => lowerName.includes(enName));
                const hasPokemonId = id === normalizePokemonInput(searchText);

                return hasPokemonId || hasTranslatedMatch || lowerName.includes(lowerSearch);
            });

            count = filteredPokemons.length;

            const start = (currentPage - 1) * MAX_LIMIT_PER_PAGE;
            const end = currentPage * MAX_LIMIT_PER_PAGE;

            pokemonsDataArr = filteredPokemons.slice(start, end);
        } else {
            const { data: pokemons, count: apiCount } = await getPokemons(offset, limit);

            pokemonsDataArr = pokemons;
            count = apiCount;
        }

        const pokemonData = await Promise.allSettled(
            pokemonsDataArr.map(async (pokemon) => {
                const pokemonData = await getPokemon(pokemon.name);

                if (!pokemonData) return null;

                return formatPokemonData(pokemonData);
            })
        );

        const completeData = pokemonData.reduce((acc, curr) => {
            if (curr.value) acc.push(curr.value);

            return acc;
        }, []);

        const totalPerPage = Math.ceil(count / (searchText ? MAX_LIMIT_PER_PAGE : limit));

        return {
            data: completeData,
            totalPerPage,
        };
    } catch (error) {
        console.error("Ocorreu um erro ao gerar os dados completos dos pokemons: ", error);

        return {
            data: [],
            totalPerPage: 0,
        };
    }
};

export const handleGetPaginationActivePage = () => {
    return Number(document.querySelector(".pagination__item--active")?.textContent) || 1;
};

const handleSubmitSearch = async (event) => {
    event.preventDefault();

    const pokemonInput = document.querySelector(".pokemon-search__input")?.value;
    const lowerInput = (pokemonInput || "").trim().toLowerCase();

    if (!lowerInput) {
        loadAndRenderPokemonsByPage(1);
        return;
    }

    loadAndRenderPokemonsByPage(1, 10000, lowerInput);
};

export const initSearchEvents = () => {
    const pokemonSearchForm = document.querySelector(".pokemon-search__form");

    pokemonSearchForm.addEventListener("submit", handleSubmitSearch);
};
