import { defineStore } from 'pinia'
import { reactive } from 'vue'

type Destination = {
  name: string
  address: string
  geometry: {
    lat: number | null
    lng: number | null
  }
}

type Position = {
  geometry: {
    lat: number | null
    lng: number | null
  }
}

export const getCurrentPosition = async (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          geometry: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      (error) => {
        reject(error)
      },
    )
  })
}

export const useLocationStore = defineStore('location', () => {
  const destination = reactive<Destination>({
    name: '',
    address: '',
    geometry: {
      lat: null,
      lng: null,
    },
  })

  const currentPosition = reactive<Position>({
    geometry: {
      lat: null,
      lng: null,
    },
  })

  const updateCurrentPosition = async () => {
    const position = await getCurrentPosition()
    currentPosition.geometry = position.geometry
  }

  return { destination, currentPosition, updateCurrentPosition }
})
