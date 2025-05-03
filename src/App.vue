<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import NavBar from '@/components/NavBar.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)

const notificationStore = useNotificationStore()
notificationStore.startPolling()

const publicRoutes = ['/login', '/register']

const isPublicRoute = computed(() => publicRoutes.includes(route.path))

onMounted(() => {
  const token = localStorage.getItem("token")
  if (!token) {
    if (!isPublicRoute.value) {
      router.replace("/login")
    }
    return
  }

  try {
    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    isAuthenticated.value = true

    // Don't redirect if already on a valid route
    if (route.path === '/' || isPublicRoute.value) {
      if (roles.includes("ROLE_LANDLORD")) router.replace("/landlord")
      else if (roles.includes("ROLE_TENANT")) router.replace("/tenant/leases")
      else if (roles.includes("ROLE_ADMIN")) router.replace("/admin/dashboard")
      else router.replace("/login")
    }

  } catch (err) {
    localStorage.removeItem("token")
    router.replace("/login")
  }
})
</script>

<template>
  <main>
    <NavBar v-if="isAuthenticated && !isPublicRoute" />
    <RouterView class="router-view" />
  </main>
</template>

<style scoped>
main {
  width: 100%;
}
</style>
