<script setup>
import {computed, ref} from "vue";
import Menubar from "primevue/menubar";
import { PrimeIcons } from '@primevue/core/api';
import router from "@/router/index.js";
import UserDropdown from "@/components/UserDropdown.vue";

/*const props = defineProps({
  userId: {
    type: Number
  },
});*/

const menuItems = ref({
  landlord: [
    {
      label: "Dashboard",
      icon: PrimeIcons.CHART_BAR,
      route: "/"
    },
    {
      label: 'Property',
      icon: PrimeIcons.HOME,
      route: "/properties",
      items: [
        {
          label: 'See Properties',
          icon: 'pi pi-bolt',
          route: "/properties",
        },
        {
          label: 'Add Property',
          icon: 'pi pi-bolt',
          route: "/add-property",
        }]
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
    }
  ],
  tenant: [
   /* {
      label: "Dashboard",
      icon: PrimeIcons.CHART_BAR,
      route: "/"
    },*/
    {
      label: "Lease",
      icon: PrimeIcons.HOME,
      route: "/leases-tenant"
    },
    {
      label: "Payments",
      icon: "pi pi-dollar",
      route: "/payments-tenant"
    },
    {
      label: "Maintenance",
      icon: "pi pi-wrench",
      route: "/maintenance-tenant"
    }
  ]
});const settings = ref([
  {
    label: "Profile",
    icon: PrimeIcons.GITHUB,
    route: "/Profile"
  }
]);

const items = computed(() => {
  return menuItems.value.tenant;
});

const navigateToProfile = () => {
  router.push({ name: "Profile" });
};
const op = ref();
const selectedMember = ref(null);

</script>

<template>
  <div class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="items" class="w-full p-0 m-0">
      <template #start >
        <span class="logo">Immobille</span>
      </template>
      <template #item="{ item,props }">
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <!-- Condition for Property item (no route) -->
          <template v-if="item.label === 'Property'">
            <div v-bind="props.action" class="flex items-center">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span class="font-bold">{{ item.label }}</span>
            </div>
          </template>
          <!-- Normal route items -->
          <template v-else-if="item.route">
            <router-link v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center">
                <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
                <span class="font-bold">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </div>
      </template>
      <template #end>
        <UserDropdown/>
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

</style>