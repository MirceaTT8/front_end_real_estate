<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import Menubar from 'primevue/menubar'
import { PrimeIcons } from '@primevue/core/api'
import UserDropdown from '@/components/UserDropdown.vue'
import NotificationBell from '@/components/notification/NotificationBell.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

const currentMenu = ref([])

const menuItems = {
  landlord: [
    { label: 'Dashboard', icon: PrimeIcons.CHART_BAR, route: '/landlord' },
    {
      label: 'Property', icon: PrimeIcons.HOME, items: [
        { label: 'See Properties', icon: 'pi pi-bolt', route: '/landlord/properties' },
        { label: 'Add Property', icon: 'pi pi-bolt', route: '/landlord/add-property' }
      ]
    },
    { label: 'Leases', icon: 'pi pi-file', route: '/landlord/leases' },
    { label: 'Payments', icon: 'pi pi-dollar', route: '/landlord/payments' },
    { label: 'Maintenance', icon: 'pi pi-wrench', route: '/landlord/maintenance' }
  ],
  tenant: [
    { label: 'Lease', icon: PrimeIcons.HOME, route: '/tenant/leases' },
    { label: 'Payments', icon: 'pi pi-dollar', route: '/tenant/payments' },
    { label: 'Maintenance', icon: 'pi pi-wrench', route: '/tenant/maintenance' }
  ],
  admin: [
    { label: 'Dashboard', icon: PrimeIcons.CHART_BAR, route: '/admin/dashboard' },
    { label: 'User Management', icon: 'pi pi-users', route: '/admin/users' },
    { label: 'System Logs', icon: 'pi pi-cog', route: '/admin/logs' },
    { label: 'Payment Management', icon: PrimeIcons.CHART_BAR, route: '/admin/payments' },
    { label: 'Maintenance Management', icon: 'pi pi-users', route: '/admin/maintenance' },
    { label: 'Property Management', icon: PrimeIcons.HOME, route: '/admin/properties' },
  ]
}

const updateMenu = () => {
  const role = authStore.userRole
  if (role === 'ROLE_LANDLORD') currentMenu.value = menuItems.landlord
  else if (role === 'ROLE_TENANT') currentMenu.value = menuItems.tenant
  else if (role === 'ROLE_ADMIN') currentMenu.value = menuItems.admin
  else currentMenu.value = []
}

onMounted(() => {
  updateMenu()
})

watch(() => authStore.userRole, updateMenu)
watch(() => route.path, updateMenu)

const hideRoutes = ['/login', '/register', '/payment/success']
const showNavBar = computed(() => {
  return authStore.isAuthenticated && !hideRoutes.includes(route.path)
})
</script>

<template>
  <div v-if="showNavBar" class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="currentMenu" class="w-full p-0 m-0">
      <template #start>
        <router-link to="/">
          <span class="logo">Immobille</span>
        </router-link>
      </template>

      <template #item="{ item, props }">
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <template v-if="item.items">
            <div v-bind="props.action" class="flex items-center">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span class="font-bold">{{ item.label }}</span>
            </div>
          </template>
          <template v-else>
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

:deep(.router-link-active) {
  @apply bg-blue-600;
}

:deep(.p-menubar-root-list) {
  background: #3b82f6;
}
:deep(.p-menubar.p-menubar-mobile-active .p-menubar-root-list) {
  @apply bg-blue-500;
}
</style>
