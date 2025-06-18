import { initPaginationEvents } from "./pokemon/pagination.js";
import { getPokemons, initSearchEvents, setPokemonsForSearch } from "./pokemon/script.js";
import { loadAndRenderPokemonsByPage } from "./ui/pokemon/script.js";

const init = async () => {
    try {
        await loadAndRenderPokemonsByPage(1);

        getPokemons(0, 10000).then((r) => setPokemonsForSearch(r.data));

        initPaginationEvents();
        initSearchEvents();
    } catch (error) {
        console.error("Ocorreu um erro ao listar os pokémons:", error);
    }
};

init();
