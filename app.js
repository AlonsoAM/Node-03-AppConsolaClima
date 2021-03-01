require('dotenv').config()

const { leerInput, inquirerMenu, pausa } = require('./helpers/inquirer')
const Busquedas = require('./models/busqueda')

// console.log(process.env)

const main = async () => {
  let opt
  const busqueda = new Busquedas()
  do {
    opt = await inquirerMenu()
    console.log('Seleccionó la opción: ', opt)

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const lugar = await leerInput('Ciudad: ')
        await busqueda.ciudad(lugar)

        // Buscar Lugares
        // Selecciona el lugar
        // Datros del clima
        // Mostrar los resultados
        console.log('\nInformación de la ciudad\n'.green)
        console.log('Ciudad:')
        console.log('Lat:')
        console.log('Lng:')
        console.log('Temperatura:')
        console.log('Máxima:')
        console.log('Mínima:')
        break
      case 2:
        break
    }

    if (opt !== 0) await pausa()
  } while (opt !== 0)
  console.log(opt)
}

main()
