import { loadAndRenderPokemonsByPage } from "../ui/pokemon/script.js";

export const handleTogglePaginationVisibility = (hidePagination = false) => {
    const pagination = document.querySelector(".pagination");

    if (hidePagination) {
        pagination.setAttribute("hidden", "");
        return;
    }

    pagination.removeAttribute("hidden");
};

export const handleUpdateActivePage = (page) => {
    document.querySelectorAll(".pagination__item").forEach((btn) => {
        btn.classList.toggle("pagination__item--active", Number(btn.textContent) === page);
    });
};

const handleUpdatePreviousAndNextButtons = (currentPage, totalPerPage) => {
    const prev = document.querySelector(".pagination__prev");
    const next = document.querySelector(".pagination__next");

    prev.disabled = currentPage === 1;
    next.disabled = currentPage === totalPerPage;
};

export const handleUpdatePaginationItems = (totalPerPage) => {
    const paginationItems = document.querySelector(".pagination__items");
    const current = Number(document.querySelector(".pagination__item--active")?.textContent) || 1;
    paginationItems.innerHTML = "";

    const pages = [1];

    const addPaginationItem = (page) => {
        const el = document.createElement(page === "..." ? "span" : "button");
        el.textContent = page;
        el.className = page === "..." ? "pagination__ellipsis" : "pagination__item";

        if (page === current) el.classList.add("pagination__item--active");

        paginationItems.appendChild(el);
    };

    if (current - 2 > 1) pages.push("...");

    if (current - 1 > 1) pages.push(current - 1);

    if (current !== 1 && current !== totalPerPage) pages.push(current);

    if (current + 1 < totalPerPage) pages.push(current + 1);

    if (current + 2 < totalPerPage) pages.push("...");

    if (totalPerPage > 1) pages.push(totalPerPage);

    pages.forEach(addPaginationItem);
    handleUpdatePreviousAndNextButtons(current, totalPerPage);
};

const handlePagination = ({ target }) => {
    const isPrevTarget = target.closest(".pagination__prev")?.classList.contains("pagination__prev");
    const isNextTarget = target.closest(".pagination__next")?.classList.contains("pagination__next");
    const isItemTarget = target.classList.contains("pagination__item");
    const actualPage = Number(document.querySelector(".pagination__item--active")?.textContent || 1);

    if (isItemTarget) {
        if (!target.classList.contains("pagination__item--active")) {
            const page = Number(target.textContent);

            loadAndRenderPokemonsByPage(page);
            return;
        }
    }

    if (isNextTarget) {
        loadAndRenderPokemonsByPage(actualPage + 1);
        return;
    }

    if (isPrevTarget) {
        loadAndRenderPokemonsByPage(actualPage - 1);
    }
};

export const initPaginationEvents = () => {
    const pagination = document.querySelector(".pagination");

    pagination.addEventListener("click", handlePagination);
};
