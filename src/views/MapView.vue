<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from '@/composables/useApi'
import { useLocationStore } from '@/stores/location'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { post } = useApi()

declare global {
  interface Window {
    google: {
      maps: {
        LatLng: new (lat: number, lng: number) => any
        DirectionsService: new () => any
        DirectionsRenderer: new (options: { map: any }) => any
        TravelMode: { DRIVING: string }
        DirectionsStatus: { OK: string }
      }
    }
  }
}

const locationStore = useLocationStore()
const router = useRouter()
const gMap = ref<{ $mapPromise: Promise<any> } | null>(null)

onMounted(async () => {
  if (locationStore.destination.name === '') {
    router.push({
      name: 'location',
    })
  }

  await locationStore.updateCurrentPosition()

  gMap.value?.$mapPromise.then((mapObject: any) => {
    const currentPoint = new window.google.maps.LatLng(
      locationStore.currentPosition.geometry.lat!,
      locationStore.currentPosition.geometry.lng!,
    )
    const destinationPoint = new window.google.maps.LatLng(
      locationStore.destination.geometry.lat!,
      locationStore.destination.geometry.lng!,
    )
    const directionsService = new window.google.maps.DirectionsService()
    const directionsDisplay = new window.google.maps.DirectionsRenderer({
      map: mapObject,
    })

    directionsService.route(
      {
        origin: currentPoint,
        destination: destinationPoint,
        avoidTolls: false,
        avoidHighways: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (res: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(res)
        } else {
          console.error(status)
        }
      },
    )
  })
})

const handleConfirmTrip = async () => {
  const response = await post(
    '/trips',
    {
      origin: locationStore.currentPosition.geometry,
      destination: locationStore.destination.geometry,
      destination_name: locationStore.destination.name,
    },
    {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  )

  if (response.error) {
    console.error(response.error)
  } else {
    router.push({ name: 'trip' })
  }
}
</script>
<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Here's your trip</h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap
              v-if="locationStore.destination.name !== ''"
              :zoom="11"
              :center="locationStore.destination.geometry"
              ref="gMap"
              style="width: 100%; height: 256px"
            >
            </GMapMap>
          </div>
          <div class="mt-2">
            <p class="text-xl">
              Going to <strong>{{ locationStore.destination.name }}</strong>
            </p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            @click="handleConfirmTrip"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
