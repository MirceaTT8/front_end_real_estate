<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";

import {fetchMaintenanceRequestsByLoggedInOwner, setStatus} from "@/services/maintenanceService.js";
import MaintenanceStatusFilter from "@/components/landlord/maintenance/MaintenanceStatusFilter.vue";
import MaintenanceListLandlord from "@/components/landlord/maintenance/MaintenanceListLandlord.vue";

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const selectedStatus = ref('all')
const router = useRouter()

onMounted(async () => {
  try {

    requests.value = await fetchMaintenanceRequestsByLoggedInOwner();
  } catch (err) {
    error.value = err.message || 'Failed to load maintenance requests';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
})

const availableStatuses = computed(() => {
  const statusSet = new Set(requests.value.map(req => req.status));
  return Array.from(statusSet);
});


const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const updatedRequest = await setStatus(requestId, newStatus);
    const index = requests.value.findIndex(req => req.requestId === requestId);
    if (index !== -1) {
      requests.value[index].status = newStatus;
      requests.value[index].updated_at = new Date().toISOString(); // or updatedRequest.updated_at if returned
    }

    selectedStatus.value = "all";

  } catch (err) {
    console.error('Error updating request status:', err);
    error.value = err.message || 'Failed to update request status';
  }
};

</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl text-gray-800">Maintenance Requests</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center p-8">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p>Loading maintenance requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg text-center">
      <p class="text-red-500 mb-4">⚠️ {{ error }}</p>
      <button @click="router.go(0)" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-all duration-200">
        Try Again
      </button>
    </div>

    <div v-else>
      <MaintenanceStatusFilter
          v-model:selectedStatus="selectedStatus"
          :availableStatuses="availableStatuses"
      />

      <MaintenanceListLandlord
          :requests="requests"
          :selected-status="selectedStatus"
          @update-status="updateRequestStatus"
      />
    </div>
  </div>
</template>