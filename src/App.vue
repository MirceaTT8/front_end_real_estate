<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from "@/components/NavBar.vue";
import Menubar from "primevue/menubar"

import { RouterView } from 'vue-router';

import {onMounted, ref} from "vue";


const items = ref([
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      { label: 'New', icon: 'pi pi-plus' },
      { label: 'Open', icon: 'pi pi-folder-open' },
      { separator: true },
      { label: 'Exit', icon: 'pi pi-times' }
    ]
  },
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    items: [
      { label: 'Undo', icon: 'pi pi-undo' },
      { label: 'Redo', icon: 'pi pi-redo' }
    ]
  },
  {
    label: 'Help',
    icon: 'pi pi-question',
    items: [
      { label: 'About', icon: 'pi pi-info-circle' }
    ]
  }
]);



</script>

<template>
  <main>
    <header></header>
    <div class="container">
      <Menubar :model="items"/>
      <RouterView class="router-view"/>
    </div>
  </main>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.router-view {
  flex-grow: 1;
  display: flex;
}

</style>
