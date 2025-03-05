const max = 200;
const lista = document.querySelector(".lista");
const searchInput = document.querySelector("#search");
const numberFiltro = document.querySelector("#number");
const nameFiltro = document.querySelector("#name");
const borrarBusqueda = document.querySelector("#borrarBusqueda");
const notFound = document.querySelector(".not-found")
const selectText = document.querySelector(".select-pokemon");
const infoCont = document.querySelector(".info-container");


let pokemons = [];
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max}`)
    .then((response) => response.json())
    .then((data) => {
        pokemons = data.results;
        mostrarPokemon(pokemons);
        //console.log(data);
        //console.log(data.results[0].name);
    });
async function fetchPokemon(pokemonID) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        if (!response.ok) throw new Error("Error al obtener el Pokémon");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

let currentPokemon = null;

function mostrarPokemon(pokemon) {
    lista.innerHTML = "";
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "item-list";
        listItem.innerHTML = `
            <div class = "number-wrap">
                <p class="caption-fonts">#${pokemonID}</p> 
            </div>
            <div class = "img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt = "${pokemon.name}"/>
            </div>
            <div class = "name-wrap">
                <p class = "hola">${capitalizeFirst(pokemon.name)}</p> 
            </div>
        `;
        listItem.addEventListener("click", async () => {
            const currentPokemon = await fetchPokemon(pokemonID);
            if (currentPokemon) {
                mostrarInformacion(currentPokemon);
                infoCont.style.display = "block";
                selectText.style.display = "none";
            } else {
                infoCont.style.display = "none";
                selectText.style.display = "flex";

            }

        });
        lista.appendChild(listItem);//no comentar esta linea 
    });
}

function mostrarInformacion(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const image = document.querySelector(".img-info img");
    image.innerHTML = "";
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    image.alt = name;

    document.querySelector(".altura-text").textContent = `${weight / 10}m`;
    document.querySelector(".peso-text").textContent = `${height / 10}kg`;
    document.querySelector(".info-nombre").textContent = `${capitalizeFirst(name)}`;
    document.querySelector(".info-id").textContent = `#${id}`;
    const especial = document.querySelector(".especial-text");
    especial.innerHTML = "";

    abilities.forEach(({ ability }) => {
        createAndAppendElement(especial, "p", {
            className: "ability-name",
            textContent: capitalizeFirst(ability.name),
        });
    });
    const statsCont = document.querySelector(".stats-container");
    statsCont.innerHTML = "";
    const statName = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };
    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsCont.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "stats",
            textContent: statName[stat.name],
        });

        createAndAppendElement(statDiv, "p", {
            className: "unu",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });
    const typeWrapper = document.querySelector(".tipo-container");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `tipo ${type.name}`,
            textContent: type.name,
        });
    });

    setBackground(pokemon);

}
function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}




searchInput.addEventListener("keyup", search);
//Filtrado
function search() {
    const searchI = searchInput.value.toLowerCase();
    let filtrado;
    if (numberFiltro.checked) {
        filtrado = pokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchI);
        });
    } else if (nameFiltro.checked) {
        filtrado = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().startsWith(searchI)
        );
    } else {
        filtrado = pokemons;
    }
    mostrarPokemon(filtrado);
    if (filtrado.length == 0) {
        notFound.style.display = "block";
        lista.style.display = "none";
    } else {
        notFound.style.display = "none";
        lista.style.display = "grid"
    }
}

borrarBusqueda.addEventListener("click", limpiar);
function limpiar() {
    searchInput.value = "";
    mostrarPokemon(pokemons);
}


async function cargarPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
                res.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
                res.json()
            ),

        ]);
        const abilities = document.querySelector(".detalles-columna .about-text .especial");
        abilities.innerHTML = "";
        if (currentPokemon == id) {
            mostrarPokemon(pokemon);
            const descrip = getDescrip(pokemonSpecies);
            document.querySelector(".stats").textContent = descrip;

        }
    } catch (error) {
        console.error("No se pudo extraer datos del pokemon", error);
        return false;

    }
}


const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
};

function setStyles(elements, cssProperty, value) {
    elements.forEach((elements) => {
        elements.style[cssProperty] = value;
    });
}

function hextoRGB(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ].join(", ");
}
function setBackground(pokemon) {
    const main = pokemon.types[0].type.name;
    //    console.log(main);
    const color = typeColors[main];
    if (!color) {
        console.warn(`Color no definido: ${main}`);
        return;
    }
    const detail = document.querySelector(".informacion");
    setStyles([detail], "backgroundColor", color);
    setStyles([detail], "borderColor", color);
    setStyles(
        document.querySelectorAll(".tipo-container > p"),
        "backgroundColor",
        color
    );
    setStyles(
        document.querySelectorAll(".stats-wrap p.stats"),
        "color",
        color
    );
    setStyles(
        document.querySelectorAll(".stats-wrap .progress-bar"),
        "color",
        color
    );
    const rgbaColor = hextoRGB(color);

    const style = document.createElement("style");
    style.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
    `;
    document.head.appendChild(style);
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


