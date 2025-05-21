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
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="flex justify-between items-center pb-6 border-b border-gray-200">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
        <p class="text-gray-500 mt-1">Manage property maintenance and repairs</p>
      </div>

      <!-- Optional - Add button here if needed -->
      <button
          @click="router.push('/maintenance/new')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center font-medium shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Request
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md">
      <div class="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      <p class="text-gray-600 text-lg">Loading maintenance requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
      <div class="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-700 font-medium text-lg">{{ store.error }}</p>
      </div>
      <button
          @click="router.go(0)"
          class="inline-flex items-center bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h2 class="text-lg font-medium text-gray-700">Filter Requests</h2>
        </div>

        <MaintenanceStatusFilter
            v-model:selectedStatus="store.selectedStatus"
            :availableStatuses="store.availableStatuses"
        />
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Maintenance Requests</h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ store.selectedStatus === 'all' ? 'All maintenance requests' : `Filtered by: ${store.selectedStatus.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, l => l.toUpperCase())}` }}
          </p>
        </div>

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
  </div>
</template>