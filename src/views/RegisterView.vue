<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phone: phone.value
    })

    const token = response.data.token
    localStorage.setItem('token', token)

    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    if (roles.includes('ROLE_LANDLORD')) {
      router.push('/landlord')
    } else if (roles.includes('ROLE_TENANT')) {
      router.push('/tenant/dashboard')
    } else if (roles.includes('ROLE_ADMIN')) {
      router.push('/admin/dashboard')
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
  <div class="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-green-700">You're Invited!</h1>
        <p class="text-gray-600 mt-1">Please create your account to access your rental dashboard.</p>
      </div>

      <form @submit.prevent="register" class="space-y-5">
        <div class="relative">
          <input
              v-model="firstName"
              type="text"
              placeholder="First Name"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <i class="pi pi-user text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="lastName"
              type="text"
              placeholder="Last Name"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <i class="pi pi-user text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <i class="pi pi-envelope text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="phone"
              type="tel"
              placeholder="Phone Number"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <i class="pi pi-phone text-gray-400 absolute left-3 top-3.5 text-lg"></i>
        </div>

        <div class="relative">
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
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

      <div class="text-center">
        <button @click="logout" class="text-sm text-red-500 hover:underline">
          Not you? Logout
        </button>
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
