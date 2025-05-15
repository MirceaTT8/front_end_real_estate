<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const password = ref('')
const email = ref('')
const token = ref('')
const error = ref('')

onMounted(() => {
  token.value = route.query.token
})

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register/invited', {
      token: token.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value
    })

    const jwt = response.data.token
    authStore.login(jwt)

    router.push('/tenant/leases')
  } catch (err) {
    error.value = err.response?.data || 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-green-700">Welcome to Your Lease</h1>
        <p class="text-gray-600 mt-1">Complete your registration to access your dashboard.</p>
      </div>

      <form @submit.prevent="register" class="space-y-5">
        <div class="relative">
          <input
              v-model="firstName"
              type="text"
              placeholder="First Name"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
          />
          <i class="pi pi-user text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="lastName"
              type="text"
              placeholder="Last Name"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
          />
          <i class="pi pi-user text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
          />
          <i class="pi pi-lock text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Create Account
        </button>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
</style>
