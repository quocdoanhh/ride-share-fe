<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span class="text-lg font-semibold text-gray-600">
            {{ userInitials }}
          </span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ authStore.userName || 'User' }}
        </p>
        <p class="text-sm text-gray-500 truncate">
          {{ authStore.userPhone }}
        </p>
      </div>
      <div>
        <button
          @click="handleLogout"
          :disabled="authStore.loading"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <span v-if="authStore.loading">Logging out...</span>
          <span v-else>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.userName
  if (!name) return 'U'

  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>
