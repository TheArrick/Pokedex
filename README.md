
### PokeDex
Este proyecto es una aplicación web que permite emular una PokeDex utilizando la [PokeAPI](https://pokeapi.co/). A continuación, se explica cómo funciona cada parte del código.





---

## Características Principales

- **Búsqueda de Pokémon**: Filtra Pokémon por nombre o número.
- **Información Detallada**: Muestra detalles como altura, peso, habilidades, estadísticas y tipos.
- **Interfaz Interactiva**: Diseño responsive con colores dinámicos según el tipo de Pokémon.

---

## Estructura del Código

### Variables Globales

```javascript
const max = 200; // Número máximo de Pokémon a cargar.
const lista = document.querySelector(".lista"); // Contenedor de la lista de Pokémon.
const searchInput = document.querySelector("#search"); // Campo de búsqueda.
const numberFiltro = document.querySelector("#number"); // Filtro por número.
const nameFiltro = document.querySelector("#name"); // Filtro por nombre.
const borrarBusqueda = document.querySelector("#borrarBusqueda"); // Botón para borrar la búsqueda.
const notFound = document.querySelector(".not-found"); // Mensaje de "no encontrado".
const selectText = document.querySelector(".select-pokemon"); // Texto de selección.
const infoCont = document.querySelector(".info-container"); // Contenedor de información detallada.

let pokemons = []; // Almacena la lista de Pokémon.
let currentPokemon = null; // Almacena el Pokémon seleccionado actualmente.
```

---

### Fetch de Pokémon

```javascript
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max}`)
    .then((response) => response.json())
    .then((data) => {
        pokemons = data.results; // Almacena los resultados en la variable `pokemons`.
        mostrarPokemon(pokemons); // Muestra los Pokémon en la lista.
    });
```

- **`fetch`**: Realiza una solicitud a la PokeAPI para obtener los primeros 200 Pokémon.
- **`mostrarPokemon`**: Función que muestra los Pokémon en la interfaz.

---

### Función para Obtener Datos de un Pokémon Específico

```javascript
async function fetchPokemon(pokemonID) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        if (!response.ok) throw new Error("Error al obtener el Pokémon");
        return await response.json(); // Devuelve los datos del Pokémon.
    } catch (error) {
        console.error(error); // Maneja errores.
        return null;
    }
}
```

- **`fetchPokemon`**: Obtiene los datos detallados de un Pokémon específico usando su ID.

---

### Mostrar Pokémon en la Lista

```javascript
function mostrarPokemon(pokemon) {
    lista.innerHTML = ""; // Limpia la lista actual.
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6]; // Extrae el ID del Pokémon.
        const listItem = document.createElement("div");
        listItem.className = "item-list";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p> 
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}"/>
            </div>
            <div class="name-wrap">
                <p class="hola">${capitalizeFirst(pokemon.name)}</p> 
            </div>
        `;
        listItem.addEventListener("click", async () => {
            const currentPokemon = await fetchPokemon(pokemonID); // Obtiene los datos del Pokémon.
            if (currentPokemon) {
                mostrarInformacion(currentPokemon); // Muestra la información detallada.
                infoCont.style.display = "block"; // Muestra el contenedor de información.
                selectText.style.display = "none"; // Oculta el texto de selección.
            } else {
                infoCont.style.display = "none"; // Oculta el contenedor de información.
                selectText.style.display = "flex"; // Muestra el texto de selección.
            }
        });
        lista.appendChild(listItem); // Añade el Pokémon a la lista.
    });
}
```

- **`mostrarPokemon`**: Muestra los Pokémon en la lista con su número, imagen y nombre.
- **Evento `click`**: Al hacer clic en un Pokémon, se muestra su información detallada.

---

### Mostrar Información Detallada de un Pokémon

```javascript
function mostrarInformacion(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const image = document.querySelector(".img-info img");
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    image.alt = name;

    document.querySelector(".altura-text").textContent = `${weight / 10}m`; // Altura.
    document.querySelector(".peso-text").textContent = `${height / 10}kg`; // Peso.
    document.querySelector(".info-nombre").textContent = `${capitalizeFirst(name)}`; // Nombre.
    document.querySelector(".info-id").textContent = `#${id}`; // ID.

    const especial = document.querySelector(".especial-text");
    especial.innerHTML = "";
    abilities.forEach(({ ability }) => {
        createAndAppendElement(especial, "p", {
            className: "ability-name",
            textContent: capitalizeFirst(ability.name), // Habilidades.
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
            textContent: statName[stat.name], // Nombre de la estadística.
        });

        createAndAppendElement(statDiv, "p", {
            className: "unu",
            textContent: String(base_stat).padStart(3, "0"), // Valor de la estadística.
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100, // Barra de progreso.
        });
    });

    const typeWrapper = document.querySelector(".tipo-container");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `tipo ${type.name}`,
            textContent: type.name, // Tipos de Pokémon.
        });
    });

    setBackground(pokemon); // Establece el color de fondo según el tipo.
}
```

- **`mostrarInformacion`**: Muestra la información detallada de un Pokémon, incluyendo su imagen, altura, peso, habilidades, estadísticas y tipos.

---

### Búsqueda y Filtrado

```javascript
searchInput.addEventListener("keyup", search);

function search() {
    const searchI = searchInput.value.toLowerCase();
    let filtrado;
    if (numberFiltro.checked) {
        filtrado = pokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchI); // Filtra por número.
        });
    } else if (nameFiltro.checked) {
        filtrado = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().startsWith(searchI) // Filtra por nombre.
        );
    } else {
        filtrado = pokemons; // Sin filtro.
    }
    mostrarPokemon(filtrado); // Muestra los Pokémon filtrados.
    if (filtrado.length == 0) {
        notFound.style.display = "block"; // Muestra "no encontrado".
        lista.style.display = "none";
    } else {
        notFound.style.display = "none";
        lista.style.display = "grid";
    }
}

borrarBusqueda.addEventListener("click", limpiar);

function limpiar() {
    searchInput.value = ""; // Limpia el campo de búsqueda.
    mostrarPokemon(pokemons); // Muestra todos los Pokémon.
}
```

- **`search`**: Filtra los Pokémon por número o nombre según la entrada del usuario.
- **`limpiar`**: Restablece la lista de Pokémon a su estado original.

---

### Colores por Tipo de Pokémon

```javascript
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
```

- **`typeColors`**: Define los colores asociados a cada tipo de Pokémon.

---

### Funciones de Utilidad

```javascript
function setStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value; // Aplica estilos a elementos.
    });
}

function hextoRGB(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ].join(", "); // Convierte un color HEX a RGB.
}

function setBackground(pokemon) {
    const main = pokemon.types[0].type.name;
    const color = typeColors[main];
    if (!color) {
        console.warn(`Color no definido: ${main}`);
        return;
    }
    const detail = document.querySelector(".informacion");
    setStyles([detail], "backgroundColor", color); // Establece el color de fondo.
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
    document.head.appendChild(style); // Aplica estilos dinámicos.
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); // Capitaliza la primera letra.
}
```

- **`setStyles`**: Aplica estilos CSS a un conjunto de elementos.
- **`hextoRGB`**: Convierte un color HEX a formato RGB.
- **`setBackground`**: Establece el color de fondo según el tipo de Pokémon.
- **`capitalizeFirst`**: Capitaliza la primera letra de una cadena.

---

