const axios = require('axios')

class Busquedas {
  historial = ['Tegucigalpa', 'Madrid', 'San José', 'Lima', 'Bogotá', 'Quito']

  constructor() {
    //TODO: Leer DB si existe
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
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
      console.log(resp.data)

      return [] // retornar los lugares
    } catch (error) {
      return []
    }
  }
}

module.exports = Busquedas
