<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isLoading = ref(true)
console.log(authStore.user)

onMounted(async () => {
  if (authStore.isLoggedIn && !authStore.user) {
    await authStore.checkAuth()
  }
  isLoading.value = false
})
</script>

<template>
  <div class="pt-16">
    <div v-if="isLoading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else>
      <h1 class="text-3xl font-semibold mb-4">
        Welcome, {{ authStore.user?.name || authStore.user?.phone || 'Guest' }}
      </h1>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div class="flex justify-between">
            <button
              class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            >
              Start Driving
            </button>
            <button
              class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            >
              Find A Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
