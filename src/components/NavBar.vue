<script>

import { useRouter } from 'vue-router'

export default {
  name: "NavBar",
  setup() {
    const router = useRouter()
    const links = router.options.routes.filter((route) => route.name !== "not-found")
    const username = "JohnDoe";

    const navigateToDashboard = () =>{
      router.push({ name: "DashboardView"});
    }

    return {
      links,
      username,
      navigateToDashboard
    }
  }

}

</script>

<template>

  <p>MyApp</p>

</template>

<style scoped>

</style>