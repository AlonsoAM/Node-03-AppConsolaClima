require('dotenv').config()

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require('./helpers/inquirer')
const Busquedas = require('./models/busqueda')

// console.log(process.env)

const main = async () => {
  let opt
  const busqueda = new Busquedas()
  do {
    opt = await inquirerMenu()
    // console.log('Seleccionó la opción: ', opt)

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino = await leerInput('Ciudad: ')

        // Buscar Lugares
        const lugares = await busqueda.ciudad(termino)

        // Selecciona el lugar
        const id = await listarLugares(lugares)
        if (id === '0') continue

        const lugarSel = lugares.find((l) => l.id === id)

        //Grabar en DB
        busqueda.agregarHistorial(lugarSel.nombre)

        // Datros del clima
        const clima = await busqueda.climaLugar(lugarSel.lat, lugarSel.lng)
        //console.log(clima)

        // Mostrar los resultados
        console.clear()
        console.log('\nInformación de la ciudad\n'.green)
        console.log('Ciudad:'.bold, lugarSel.nombre.green)
        console.log('Lat:'.bold, lugarSel.lat)
        console.log('Lng:'.bold, lugarSel.lng)
        console.log('Temperatura:'.bold, clima.temp + '°C')
        console.log('Máxima:'.bold, clima.max + '°C')
        console.log('Mínima:'.bold, clima.min + '°C')
        console.log('Actualmente el clima se encuentra:'.bold, clima.desc.green)
        break
      case 2:
        console.log('\n')
        busqueda.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green
          console.log(`${idx} ${lugar}`)
        })

        break
    }

    if (opt !== 0) await pausa()
  } while (opt !== 0)
  console.log(opt)
}

main()
