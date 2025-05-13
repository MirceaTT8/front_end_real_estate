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
    <div class="relative inline-block text-left">
      <button
          @click="handleClick"
          class="bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-cyan-800 focus:outline-none transition duration-300 shadow-md"
      >
        <i :class="PrimeIcons.USER" class="mr-2"></i>
        <span>My Account</span>
        <i :class="PrimeIcons.CHEVRON_DOWN" class="ml-2 text-xs"></i>
      </button>

      <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
      >
        <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div
              v-for="item in settings"
              :key="item.label"
              @click="item.command ? item.command() : navigateTo(item.route)"
              class="px-4 py-3 text-gray-700 hover:bg-cyan-100 hover:text-cyan-900 cursor-pointer flex items-center transition-all"
          >
            <i :class="item.icon" class="mr-2 text-cyan-700"></i>
            {{ item.label }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
