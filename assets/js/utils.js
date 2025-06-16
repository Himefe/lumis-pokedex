export const capitalize = (str = "") => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const normalizePokemonInput = (input) => {
    const numeric = input.replace(/^#/, "");

    if (!isNaN(Number(numeric))) {
        return Number(numeric);
    }

    return input;
};
