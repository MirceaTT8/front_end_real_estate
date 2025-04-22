
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
      route: "/landlord"
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
  ],
  admin: [
    {
      label: "Dashboard",
      icon: PrimeIcons.CHART_BAR,
      route: "/admin/dashboard"
    },
    {
      label: "User Management",
      icon: "pi pi-users",
      route: "/admin/users"
    },
    {
      label: "System Logs",
      icon: "pi pi-cog",
      route: "/admin/logs"
    },
    /*
{
label: "Reports",
icon: "pi pi-chart-bar",
items: [
  {
    label: "Financial",
    route: "/admin/reports/financial"
  },
  {
    label: "Activity",
    route: "/admin/reports/activity"
  }
]
}

 */
]

});

const currentMenu = ref(menuItems.value.landlord);
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