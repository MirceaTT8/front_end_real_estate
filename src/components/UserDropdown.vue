<script setup>
import { PrimeIcons } from '@primevue/core/api';
import { useRouter } from 'vue-router';
import {ref} from "vue";

const router = useRouter();

const settings = ref([
  {
    label: "Profile",
    icon: PrimeIcons.USER,
    route: "/profile"
  },
  {
    label: "Settings",
    icon: PrimeIcons.COG,
    route: "/settings"
  },
  {
    label: "Logout",
    icon: PrimeIcons.SIGN_OUT,
    command: () => console.log('Logout logic here')
  }
]);

const navigateTo = (route) => {
  router.push(route);
};
</script>

<template>
  <div class="navbar-user">
    <div class="dropdown">
      <button class="dropdown-button">
        <i :class="PrimeIcons.USER" class="mr-2"></i>
        <span>My Account</span>
      </button>
      <div class="dropdown-content">
        <div v-for="item in settings" :key="item.label"
             @click="item.command ? item.command() : navigateTo(item.route)"
             class="dropdown-item">
          <i :class="item.icon" class="mr-2"></i>
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-user {
  position: relative;
  margin-right: 1rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #36849c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.dropdown-button:hover {
  background-color: #2a6a7d;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #36849c;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

.dropdown-item {
  color: white;
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #2a6a7d;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>