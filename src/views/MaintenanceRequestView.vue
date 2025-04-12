<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";

import {fetchMaintenanceRequestsByOwner, setStatus} from "@/services/maintenanceService.js";

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const selectedStatus = ref('all')
const router = useRouter()

onMounted(async () => {
  try {

    const ownerId = 1;

    requests.value = await fetchMaintenanceRequestsByOwner(ownerId);
    console.log(requests.value)
  } catch (err) {
    error.value = err.message || 'Failed to load maintenance requests';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
})

const filteredRequests = computed(() => {
  if (selectedStatus.value === 'all') return requests.value
  return requests.value.filter(req => req.status === selectedStatus.value)
})

const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const updatedRequest = await setStatus(requestId, newStatus);
    const index = requests.value.findIndex(req => req.requestId === requestId);
    if (index !== -1) {
      requests.value[index].status = newStatus;
      requests.value[index].updated_at = new Date().toISOString(); // or updatedRequest.updated_at if returned
    }
  } catch (err) {
    console.error('Error updating request status:', err);
    error.value = err.message || 'Failed to update request status';
  }
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
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

    <!-- Content -->
    <div v-else>
      <!-- Status Filter -->
      <div class="flex items-center gap-4 mb-6">
        <label class="font-medium">Filter by status:</label>
        <select v-model="selectedStatus" class="py-2 px-4 border border-gray-300 rounded-md min-w-48">
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <!-- Request List -->
      <div v-if="filteredRequests.length > 0" class="grid gap-6">
        <div v-for="request in filteredRequests" :key="request.request_id" class="bg-white rounded-lg p-6 shadow">
          <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <h3 class="text-lg font-medium m-0">Request #{{ request.request_id }}</h3>
            <span
                class="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize"
                :class="{
                'bg-amber-50 text-amber-600': request.status === 'pending',
                'bg-blue-50 text-blue-600': request.status === 'in_progress',
                'bg-green-50 text-green-600': request.status === 'resolved',
                'bg-red-50 text-red-500': request.status === 'cancelled'
              }"
            >
              {{ request.status.replace('_', ' ') }}
            </span>
          </div>

          <div class="grid gap-3 mb-6">
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Property:</span>
              <span class="flex-1">{{ request.property_address }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Lease:</span>
              <span class="flex-1">{{ request.leaseId }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Description:</span>
              <span class="flex-1">{{ request.description }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Submitted:</span>
              <span class="flex-1">{{ formatDate(request.createdAt) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Last Updated:</span>
              <span class="flex-1">{{ formatDate(request.updatedAt) }}</span>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700">Change status:</label>
            <select
                :value="request.status"
                @change="updateRequestStatus(request.requestId, $event.target.value)"
                class="py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-8 text-center">
        <div class="text-5xl mb-4 opacity-50">🔧</div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">No maintenance requests found</h3>
        <p class="text-gray-600">There are no {{ selectedStatus === 'all' ? '' : selectedStatus.replace('_', ' ') + ' ' }}requests at this time.</p>
      </div>
    </div>
  </div>
</template>