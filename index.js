require('colors');
require('dotenv').config();

const {
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares
} = require('./helpers/inquirer');

console.clear();

const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                //guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //mostrar resultados

                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', `${lugarSel.nombre.green}`);
                console.log('Lat:', `${ lugarSel.lat}`.green);
                console.log('Lng:', `${lugarSel.lng}`.green);
                console.log('Temperatura:', `${clima.temp}`.green);
                console.log('Mínima:', `${clima.min}`.green);
                console.log('Máxima:', `${clima.max}`.green);
                console.log('Como está el clima:', `${clima.desc.green}`);
                break;
            case 2:
                console.clear();
                console.log('\nHistorial de Búsquedas\n'.green);
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx.green} ${lugar}`)
                });
                break;

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0)

}

main();