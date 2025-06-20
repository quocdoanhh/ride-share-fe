<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface UserCredentials {
  phone: string | null
  code: string | null
}

const credentials = reactive<UserCredentials>({
  phone: null,
  code: null,
})

const waitingForVerification = ref<boolean>(false)
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push({
      name: 'landing',
    })
  }
})

const formatedCredentials = computed(() => {
  return {
    phone: credentials.phone?.replace(/-/g, ''),
    code: credentials.code,
  }
})

const validationError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const handleLogin = async () => {
  validationError.value = null
  successMessage.value = null

  if (!credentials.phone) {
    validationError.value = 'Please enter your phone number'
    return
  }

  const result = await authStore.login({ phone: formatedCredentials.value.phone || '' })

  if (result.success) {
    successMessage.value = result.message || 'Verification code sent to your phone'
    waitingForVerification.value = true
  } else {
    validationError.value = result.message || 'Something went wrong'
  }
}

const handleVerification = async () => {
  validationError.value = null
  successMessage.value = null

  if (!formatedCredentials.value.code) {
    validationError.value = 'Please enter verification code'
    return
  }

  if (!formatedCredentials.value.phone) {
    validationError.value = 'Phone number is required'
    return
  }

  const result = await authStore.verifyCode(
    formatedCredentials.value.phone,
    formatedCredentials.value.code,
  )

  if (result.success) {
    router.push({
      name: 'landing',
    })
  } else {
    validationError.value = result.message || 'Invalid verification code'
  }
}

const clearValidationError = () => {
  validationError.value = null
  successMessage.value = null
}

const goBackToLogin = () => {
  waitingForVerification.value = false
  credentials.code = ''
  validationError.value = null
  successMessage.value = null
}
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ waitingForVerification ? 'Enter verification code' : 'Enter your phone number' }}
    </h1>

    <div
      v-if="authStore.error"
      class="max-w-sm mx-auto mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ authStore.error }}
    </div>

    <!-- Success message -->
    <div
      v-if="successMessage"
      class="max-w-sm mx-auto mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"
    >
      {{ successMessage }}
    </div>

    <form v-if="!waitingForVerification" action="#" @submit.prevent="handleLogin">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input
              type="text"
              v-maska
              data-maska="###-###-####"
              v-model.trim="credentials.phone"
              @input="clearValidationError"
              name="phone"
              id="phone"
              placeholder="123-456-7890"
              :class="[
                'mt-1 block w-full px-3 py-2 rounded-md border shadow-sm focus:outline-none',
                validationError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black',
              ]"
            />
            <p v-if="validationError" class="mt-1 text-sm text-red-600">
              {{ validationError }}
            </p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            :disabled="authStore.loading || !credentials.phone"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Processing...</span>
            <span v-else>Continue</span>
          </button>
        </div>
      </div>
    </form>

    <form v-else action="#" @submit.prevent="handleVerification">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input
              type="text"
              v-maska
              data-maska="######"
              v-model.trim="credentials.code"
              @input="clearValidationError"
              name="login_code"
              id="login_code"
              placeholder="123456"
              :class="[
                'mt-1 block w-full px-3 py-2 rounded-md border shadow-sm focus:outline-none',
                validationError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black',
              ]"
            />
            <p v-if="validationError" class="mt-1 text-sm text-red-600">
              {{ validationError }}
            </p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            @click="goBackToLogin"
            class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            :disabled="authStore.loading || !credentials.code"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Verifying...</span>
            <span v-else>Verify</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
