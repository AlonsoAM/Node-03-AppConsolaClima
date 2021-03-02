const fs = require('fs')
const axios = require('axios')

class Busquedas {
  historial = []
  dbPath = './db/database.json'

  constructor() {
    //TODO: Leer DB si existe
    this.leerDB()
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(' ')
      palabras = palabras.map(
        (palabra) => palabra[0].toUpperCase() + palabra.substring(1),
      )
      return palabras.join(' ')
    })
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
    }
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
      lang: 'es',
    }
  }

  async ciudad(lugar = '') {
    try {
      // Petición http
      // console.log('Ciudad', lugar)

      const instance = axios.create({
        baseURL: `
        https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json
        `,
        params: this.paramsMapBox,
      })

      const resp = await instance.get()
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name_es,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }))
    } catch (error) {
      return []
    }
  }

  async climaLugar(lat, lon) {
    try {
      //instance de axios
      const instance = axios.create({
        baseURL: `
        https://api.openweathermap.org/data/2.5/weather
        `,
        params: {
          lat,
          lon,
          ...this.paramsWeather,
        },
      })

      // extraer informacion del resp.data
      const resp = await instance.get()

      // const desc = resp.data.weather.map((clima) => clima.description)
      // const temperatura = resp.data.main

      const { weather, main } = resp.data

      // return
      return {
        desc: weather[0].description,
        temp: main.temp,
        max: main.temp_max,
        min: main.temp_min,
      }
    } catch (error) {
      console.log(error)
    }
  }

  agregarHistorial(lugar = '') {
    // Agregar al historial
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return
    } else {
      this.historial = this.historial.splice(0, 5)
      this.historial.unshift(lugar.toLocaleLowerCase())
    }

    // Grabar en DB o archivo de Texto
    this.guardarDB()
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }
  leerDB() {
    if (!fs.existsSync(this.dbPath)) return

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
    const data = JSON.parse(info)
    this.historial = data.historial
  }
}

module.exports = Busquedas
