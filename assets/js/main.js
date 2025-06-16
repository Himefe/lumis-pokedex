import { initPaginationEvents } from "./pokemon/pagination.js";
import { initSearchEvents } from "./pokemon/script.js";
import { loadAndRenderPokemonsByPage } from "./ui/pokemon/script.js";

const init = async () => {
    try {
        await loadAndRenderPokemonsByPage(1);

        initPaginationEvents();
        initSearchEvents();
    } catch (error) {
        console.error("Ocorreu um erro ao listar os pokémons:", error);
    }
};

init();
