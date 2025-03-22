<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import { PrimeIcons } from '@primevue/core/api';
import router from "@/router/index.js";

/*const props = defineProps({
  userId: {
    type: Number
  },
});*/

const items = ref([
  {
    label: "Dashboard",
    icon: PrimeIcons.TWITTER,
    route: "/"
  },
  {
    label: "Property",
    icon: PrimeIcons.HOME,
    route: "/properties"
  },
  {
    label: "Tenants",
    icon: "pi pi-users",
    route: "/tenants"
  },
  {
    label: "Leases",
    icon: "pi pi-file",
    route: "/leases"
  },
  {
    label: "Payments",
    icon: "pi pi-dollar",
    route: "/payments"
  },
  {
    label: "Maintenance",
    icon: "pi pi-wrench",
    route: "/maintenance"
  },
]);

const settings = ref([
  {
    label: "Profile",
    icon: PrimeIcons.GITHUB,
    route: "/Profile"
  }
]);

const navigateToProfile = () => {
  router.push({ name: "Profile" });
};
const op = ref();
const selectedMember = ref(null);

</script>

<template>
  <!-- Wrapper div with flexbox properties -->
  <div class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="items" class="w-full p-0 m-0">
      <template #start >
        <span class="logo">Immobille</span>
      </template>
      <template #item="{ item,props }" #>
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span class="font-bold">{{ item.label }} </span>
            </a>
          </router-link>
        </div>
      </template>
      <template #end>
        <div class="navbar-user">
          <div class="dropdown">
            <button class="dropdown-button" >
              <p> Ma man!</p>
            </button>
            <div class="dropdown-content">
              <p @click="navigateToProfile">Manage Account</p>
            </div>
          </div>
        </div>
      </template>

    </Menubar>
  </div>
</template>

<style scoped>

.logo {
  font-family: 'Brush Script MT', cursive;
  color:#ffffff;
  margin-left:10px;
}

.navbar-user {
  position: relative;
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
}

.dropdown-button:hover {
  background-color: #555;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #17ecec;
  min-width: 150px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content p {
  color: white;
  padding: 0.5rem 1rem;
  margin: 0;
  cursor: pointer;
}

.dropdown-content p:hover {
  background-color: #17ecec;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>