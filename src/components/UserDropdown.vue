<script setup>
import { PrimeIcons } from '@primevue/core/api';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const showMenu = ref(false);

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const settings = ref([
  {
    label: "Profile",
    icon: PrimeIcons.USER,
    route: "/profile"
  },
  {
    label: "Logout",
    icon: PrimeIcons.SIGN_OUT,
    command: logout
  }
]);

const navigateTo = (route) => {
  showMenu.value = false;
  router.push(route);
};

const handleClick = () => {
  showMenu.value = !showMenu.value;
};
</script>
<template>
  <div class="relative mr-4">
    <div class="relative inline-block">
      <button
          class="bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-cyan-800 transition duration-300"
          @click="handleClick"
      >
        <i :class="PrimeIcons.USER" class="mr-2"></i>
        <span>My Account</span>
      </button>

      <div
          v-if="showMenu"
          class="absolute right-0 mt-1 w-48 bg-cyan-700 rounded-md shadow-lg z-50"
      >
        <div
            v-for="item in settings"
            :key="item.label"
            @click="item.command ? item.command() : navigateTo(item.route)"
            class="px-4 py-2 text-white hover:bg-cyan-800 cursor-pointer flex items-center transition-colors"
        >
          <i :class="item.icon" class="mr-2"></i>
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

