async function explorarPokemon() {

    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/bulbasaur");

    console.log("Status:", respuesta.status);

    const datos = await respuesta.json();

    console.log(datos);

    console.log("TIPOS:");

    for (const t of datos.types) {
        console.log(t.type.name);
    }

    console.log("STATS:");

    for (const s of datos.stats) {
        console.log(s.stat.name, ":", s.base_stat);
    }

    console.log("HABILIDADES:");

    for (const a of datos.abilities) {
        console.log(a.ability.name);
    }
}

explorarPokemon();


async function buscarPokemon(nombre) {

    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        console.log("Error:", respuesta.status);
        return null;
    }

    return await respuesta.json();
}


function mostrarFicha(datos) {

    if (!datos) {
        console.log("No hay información del Pokémon");
        return;
    }

    console.log("==============================");
    console.log("POKÉMON:", datos.name.toUpperCase());
    console.log("NÚMERO:", datos.id);

    const tipos = [];

    for (const t of datos.types) {
        tipos.push(t.type.name);
    }

    console.log("TIPO:", tipos.join(" / "));

    console.log("ALTURA:", datos.height * 10, "cm");
    console.log("PESO:", datos.weight / 10, "kg");

    console.log("STATS:");

    for (const s of datos.stats) {
        console.log(s.stat.name, ":", s.base_stat);
    }

    console.log("HABILIDADES:");

    for (const a of datos.abilities) {

        if (a.is_hidden) {
            console.log(a.ability.name, "(oculta)");
        } else {
            console.log(a.ability.name);
        }

    }

    console.log("==============================");
}


function obtenerStat(datos, nombreStat) {

    for (const s of datos.stats) {

        if (s.stat.name === nombreStat) {
            return s.base_stat;
        }

    }

    return null;
}


async function compararPokemon(nombre1, nombre2, stat) {

    const pokemon1 = await buscarPokemon(nombre1);
    const pokemon2 = await buscarPokemon(nombre2);

    if (pokemon1 === null || pokemon2 === null) {
        console.log("No se pueden comparar los Pokémon");
        return;
    }

    const valor1 = obtenerStat(pokemon1, stat);
    const valor2 = obtenerStat(pokemon2, stat);

    if (valor1 === null || valor2 === null) {
        console.log("Stat no válida");
        return;
    }

    console.log(`${pokemon1.name}: ${valor1}`);
    console.log(`${pokemon2.name}: ${valor2}`);

    if (valor1 > valor2) {
        console.log(`Gana ${pokemon1.name}`);
    } else if (valor2 > valor1) {
        console.log(`Gana ${pokemon2.name}`);
    } else {
        console.log("Hay empate");
    }
}


compararPokemon("bulbasaur", "charmander", "attack");
async function pokemonMasFuerte(listaNombres, stat) {

    let mejorNombre = null;
    let mejorValor = -1;

    for (const nombre of listaNombres) {

        const pokemon = await buscarPokemon(nombre);

        if (pokemon === null) {
            continue;
        }

        const valor = obtenerStat(pokemon, stat);

        if (valor === null) {
            continue;
        }

        if (valor > mejorValor) {
            mejorValor = valor;
            mejorNombre = pokemon.name;
        }
    }

    console.log("El más fuerte en", stat, "es:", mejorNombre);
    console.log("Valor:", mejorValor);

    return mejorNombre;
}
async function probarMasFuerte() {

    const equipo = [
        "bulbasaur",
        "charmander",
        "squirtle",
        "pikachu"
    ];

    await pokemonMasFuerte(equipo, "attack");
}

probarMasFuerte();
async function desafioFinal() {

    const equipo = [
        "bulbasaur",
        "charizard",
        "blastoise",
        "snorlax",
        "machamp",
        "garchomp"
    ];

    const ganadorAttack = await pokemonMasFuerte(equipo, "attack");

    const ganadorDefense = await pokemonMasFuerte(equipo, "defense");

    const pokemonGanador = await buscarPokemon(ganadorAttack);

    mostrarFicha(pokemonGanador);
}

desafioFinal();