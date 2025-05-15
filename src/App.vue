<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import NavBar from '@/components/NavBar.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const isAuthenticated = ref(false)
const notificationStore = useNotificationStore()
notificationStore.startPolling()

onMounted(() => {
  const token = localStorage.getItem("token")


  try {
    const decoded = jwtDecode(token)
    const roles = decoded.authorities || []

    isAuthenticated.value = true

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
