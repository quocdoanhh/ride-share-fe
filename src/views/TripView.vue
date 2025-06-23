<script setup lang="ts">
import { useLocationStore } from '@/stores/location'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const locationStore = useLocationStore()
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4"></h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap
              :zoom="14"
              :center="locationStore.currentPosition.geometry"
              ref="gMap"
              style="width: 100%; height: 256px"
            >
              <GMapMarker :position="locationStore.currentPosition.geometry" />
              <!-- <GMapMarker :position="locationStore.destination.geometry" :icon="driverIcon" /> -->
            </GMapMap>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <span>Message</span>
        </div>
      </div>
    </div>
  </div>
</template>
