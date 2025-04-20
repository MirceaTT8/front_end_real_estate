<!--<script setup>-->
<!--import {computed, ref} from "vue";-->
<!--import Menubar from "primevue/menubar";-->
<!--import { PrimeIcons } from '@primevue/core/api';-->
<!--import router from "@/router/index.js";-->
<!--import UserDropdown from "@/components/UserDropdown.vue";-->
<!--import NotificationBell from "@/components/notification/NotificationBell.vue";-->


<!--const menuItems = ref({-->
<!--  landlord: [-->
<!--    {-->
<!--      label: "Dashboard",-->
<!--      icon: PrimeIcons.CHART_BAR,-->
<!--      route: "/"-->
<!--    },-->
<!--    {-->
<!--      label: 'Property',-->
<!--      icon: PrimeIcons.HOME,-->
<!--      route: "/properties",-->
<!--      items: [-->
<!--        {-->
<!--          label: 'See Properties',-->
<!--          icon: 'pi pi-bolt',-->
<!--          route: "/properties",-->
<!--        },-->
<!--        {-->
<!--          label: 'Add Property',-->
<!--          icon: 'pi pi-bolt',-->
<!--          route: "/add-property",-->
<!--        }]-->
<!--    },-->
<!--    {-->
<!--      label: "Leases",-->
<!--      icon: "pi pi-file",-->
<!--      route: "/leases"-->
<!--    },-->
<!--    {-->
<!--      label: "Payments",-->
<!--      icon: "pi pi-dollar",-->
<!--      route: "/payments"-->
<!--    },-->
<!--    {-->
<!--      label: "Maintenance",-->
<!--      icon: "pi pi-wrench",-->
<!--      route: "/maintenance"-->
<!--    }-->
<!--  ],-->
<!--  tenant: [-->
<!--   /* {-->
<!--      label: "Dashboard",-->
<!--      icon: PrimeIcons.CHART_BAR,-->
<!--      route: "/"-->
<!--    },*/-->
<!--    {-->
<!--      label: "Lease",-->
<!--      icon: PrimeIcons.HOME,-->
<!--      route: "/leases-tenant"-->
<!--    },-->
<!--    {-->
<!--      label: "Payments",-->
<!--      icon: "pi pi-dollar",-->
<!--      route: "/payments-tenant"-->
<!--    },-->
<!--    {-->
<!--      label: "Maintenance",-->
<!--      icon: "pi pi-wrench",-->
<!--      route: "/maintenance-tenant"-->
<!--    }-->
<!--  ]-->
<!--});const settings = ref([-->
<!--  {-->
<!--    label: "Profile",-->
<!--    icon: PrimeIcons.GITHUB,-->
<!--    route: "/Profile"-->
<!--  }-->
<!--]);-->

<!--const items = computed(() => {-->
<!--  return menuItems.value.landlord;-->
<!--});-->

<!--const navigateToProfile = () => {-->
<!--  router.push({ name: "Profile" });-->
<!--};-->
<!--const op = ref();-->
<!--const selectedMember = ref(null);-->

<!--</script>-->

<!--<template>-->
<!--  <div class="card w-full bg-blue-500 p-0 m-0">-->
<!--    <Menubar :model="items" class="w-full p-0 m-0">-->
<!--      <template #start >-->
<!--        <span class="logo">Immobille</span>-->
<!--      </template>-->
<!--      <template #item="{ item,props }">-->
<!--        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">-->
<!--          &lt;!&ndash; Condition for Property item (no route) &ndash;&gt;-->
<!--          <template v-if="item.label === 'Property'">-->
<!--            <div v-bind="props.action" class="flex items-center">-->
<!--              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>-->
<!--              <span class="font-bold">{{ item.label }}</span>-->
<!--            </div>-->
<!--          </template>-->
<!--          &lt;!&ndash; Normal route items &ndash;&gt;-->
<!--          <template v-else-if="item.route">-->
<!--            <router-link v-slot="{ href, navigate }" :to="item.route" custom>-->
<!--              <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center">-->
<!--                <i v-if="item.icon" :class="item.icon" class="mr-2"></i>-->
<!--                <span class="font-bold">{{ item.label }}</span>-->
<!--              </a>-->
<!--            </router-link>-->
<!--          </template>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #end>-->
<!--        <div class="flex items-center gap-4">-->
<!--          <NotificationBell />-->
<!--          <UserDropdown />-->
<!--        </div>-->
<!--      </template>-->
<!--    </Menubar>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->

<!--.logo {-->
<!--  font-family: 'Brush Script MT', cursive;-->
<!--  color:#ffffff;-->
<!--  margin-left:10px;-->
<!--}-->

<!--</style>-->

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import { PrimeIcons } from '@primevue/core/api';
import UserDropdown from "@/components/UserDropdown.vue";
import NotificationBell from "@/components/notification/NotificationBell.vue";

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
      items: [
        {
          label: 'See Properties',
          icon: 'pi pi-bolt',
          route: "/landlord/properties"
        },
        {
          label: 'Add Property',
          icon: 'pi pi-bolt',
          route: "/landlord/add-property"
        }
      ]
    },
    {
      label: "Leases",
      icon: "pi pi-file",
      route: "/landlord/leases"
    },
    {
      label: "Payments",
      icon: "pi pi-dollar",
      route: "/landlord/payments"
    },
    {
      label: "Maintenance",
      icon: "pi pi-wrench",
      route: "/landlord/maintenance"
    }
  ],
  tenant: [
    {
      label: "Lease",
      icon: PrimeIcons.HOME,
      route: "/tenant/leases"
    },
    {
      label: "Payments",
      icon: "pi pi-dollar",
      route: "/tenant/payments"
    },
    {
      label: "Maintenance",
      icon: "pi pi-wrench",
      route: "/tenant/maintenance"
    }
  ]
});

// Default to landlord menu - you can change this as needed
const currentMenu = ref(menuItems.value.tenant);
</script>

<template>
  <div class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="currentMenu" class="w-full p-0 m-0">
      <template #start>
        <router-link to="/">
          <span class="logo">Immobille</span>
        </router-link>
      </template>

      <template #item="{ item, props }">
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <template v-if="item.items">
            <!-- Dropdown items (like Property) -->
            <div v-bind="props.action" class="flex items-center">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span class="font-bold">{{ item.label }}</span>
            </div>
          </template>
          <template v-else>
            <!-- Regular route items -->
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
        <div class="flex items-center gap-4">
          <NotificationBell />
          <router-link
              to="/profile"
              class="flex items-center gap-2 text-white hover:text-blue-100 p-2"
          >
            <i :class="PrimeIcons.USER" class="mr-1"></i>
            <span class="font-bold">Profile</span>
          </router-link>
          <UserDropdown />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
.logo {
  font-family: 'Brush Script MT', cursive;
  color: #ffffff;
  margin-left: 10px;
  font-size: 1.5rem;
}

/* Style for active menu items */
:deep(.router-link-active) {
  @apply bg-blue-600;
}

/* Dropdown menu styling */
:deep(.p-menubar-root-list) {
  background: #3b82f6;
}
:deep(.p-menubar.p-menubar-mobile-active .p-menubar-root-list) {
  @apply bg-blue-500;
}
</style>