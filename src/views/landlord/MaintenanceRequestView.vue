<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceLandlordStore } from "@/stores/maintenanceStore.js";
import MaintenanceStatusFilter from '@/components/landlord/maintenance/MaintenanceStatusFilter.vue'
import MaintenanceListLandlord from '@/components/landlord/maintenance/MaintenanceListLandlord.vue'

const router = useRouter()
const store = useMaintenanceLandlordStore()

onMounted(async () => {
  await store.loadRequests()
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl text-gray-800">Maintenance Requests</h1>
    </header>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center p-8">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p>Loading maintenance requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="bg-red-50 p-6 rounded-lg text-center">
      <p class="text-red-500 mb-4">⚠️ {{ store.error }}</p>
      <button @click="router.go(0)" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-all duration-200">
        Try Again
      </button>
    </div>

    <div v-else>
      <MaintenanceStatusFilter
          v-model:selectedStatus="store.selectedStatus"
          :availableStatuses="store.availableStatuses"
      />

      <MaintenanceListLandlord
          :requests="store.filteredRequests"
          :leases="store.leases"
          :tenants="store.tenants"
          :properties="store.properties"
          :selected-status="store.selectedStatus"
          @update-status="store.updateStatus"
      />
    </div>
  </div>
</template>
