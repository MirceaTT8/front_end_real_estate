<script setup>
import NavBar from "@/components/NavBar.vue";

import { RouterView } from 'vue-router';

</script>

<template>
  <main>
    <div>
      <NavBar />
      <RouterView class="router-view"/>
    </div>
  </main>
</template>

<style scoped>

main {
  width: 100%;
}



</style>
