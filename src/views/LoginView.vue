<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.token
    localStorage.setItem('token', token)

    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    if (roles.includes('ROLE_LANDLORD')) {
      router.push('/landlord')
    } else if (roles.includes('ROLE_TENANT')) {
      router.push('/tenant/leases')
    } else if (roles.includes('ROLE_ADMIN')) {
      router.push('/admin/dashboard')
    }
    else {
      error.value = 'Unauthorized role.'
    }

  } catch (err) {
    error.value = 'Invalid credentials.'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded p-2" />
      <input v-model="password" type="password" placeholder="Password" class="w-full border rounded p-2" />
      <button type="submit" class="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Login</button>
      <p class="text-red-600 text-sm" v-if="error">{{ error }}</p>
    </form>

    <div class="mt-4 text-center text-sm text-gray-700">
      Don’t have an account?
      <router-link to="/register" class="text-blue-600 hover:underline">Register here</router-link>
    </div>
  </div>
</template>
