<script setup>
import NavBar from "@/components/NavBar.vue"
import { RouterView, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  const token = localStorage.getItem("token")

  if (!token) {
    router.replace("/login")
    return
  }

  try {
    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    isAuthenticated.value = true // ✅ set true only if token is valid

    if (roles.includes("ROLE_LANDLORD")) {
      router.replace("/landlord/dashboard")
    } else if (roles.includes("ROLE_TENANT")) {
      router.replace("/tenant/dashboard")
    } else {
      router.replace("/login")
    }
  } catch (err) {
    localStorage.removeItem("token")
    router.replace("/login")
  }
})
</script>


<template>
  <main>
    <NavBar v-if="isAuthenticated" />
    <RouterView class="router-view" />
  </main>
</template>

<style scoped>
main {
  width: 100%;
}
</style>
