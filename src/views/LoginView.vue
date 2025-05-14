<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.token
    authStore.login(token)

    // Use authStore's role to navigate accordingly
    switch (authStore.userRole) {
      case 'ROLE_LANDLORD':
        router.push('/landlord')
        break
      case 'ROLE_TENANT':
        router.push('/tenant/leases')
        break
      case 'ROLE_ADMIN':
        router.push('/admin/dashboard')
        break
      default:
        error.value = 'Unauthorized role.'
    }
  } catch (err) {
    error.value = 'Invalid credentials.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-blue-700">Welcome Back</h1>
        <p class="text-gray-600 text-sm mt-1">Login to manage your properties and tenants.</p>
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <div class="relative">
          <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <i class="pi pi-envelope text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <i class="pi pi-lock text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Login
        </button>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
      </form>

      <div class="text-center text-sm text-gray-600">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 hover:underline font-medium">Register here</router-link>
      </div>
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
