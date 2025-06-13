import { getCompletePokemonData, initSearchEvents } from "./pokemon/script.js";
import { renderPokemonList, showLoading } from "./ui/pokemon/script.js";

const init = async () => {
    try {
        showLoading();
        const pokemons = await getCompletePokemonData();

        renderPokemonList(pokemons);
        initSearchEvents();
    } catch (error) {
        console.error("Ocorreu um erro ao listar os pokémons:", error);
    }
};

init();
