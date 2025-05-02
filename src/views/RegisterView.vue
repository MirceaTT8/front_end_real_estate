<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })
    console.log(response.data)

    const token = response.data.token
    localStorage.setItem('token', token)

    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    if (roles.includes('ROLE_LANDLORD')) {
      router.push('/landlord')
    }
    if (roles.includes('ROLE_TENANT')) {
      router.push('/tenant/dashboard')
    } else {
      error.value = 'Unauthorized role.'
    }
  } catch (err) {
    error.value = 'Registration failed. Check your input.'
  }
}
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="register" class="space-y-4">
      <input v-model="firstName" type="text" placeholder="First Name" class="w-full border rounded p-2" />
      <input v-model="lastName" type="text" placeholder="Last Name" class="w-full border rounded p-2" />
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded p-2" />
      <input v-model="password" type="password" placeholder="Password" class="w-full border rounded p-2" />
      <button type="submit" class="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Register</button>
      <p class="text-red-600 text-sm" v-if="error">{{ error }}</p>
      <button @click="logout" class="text-red-600 hover:underline">Logout</button>
    </form>
  </div>

</template>
