<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";

import {fetchMaintenanceRequestsByOwner} from "@/services/maintenanceService.js";

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const selectedStatus = ref('all')
const router = useRouter()

onMounted(async () => {
  try {

    const ownerId = 1;

    requests.value = await fetchMaintenanceRequestsByOwner(ownerId);
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
    const request = requests.value.find(req => req.request_id === requestId)
    if (request) {
      const response = await fetch(`${API}/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state if API call succeeds
      request.status = newStatus
      request.updated_at = new Date().toISOString()
    }
  } catch (err) {
    console.error('Error updating request status:', err)
    error.value = err.message || 'Failed to update request status'
  }
}

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
              <span class="font-medium w-32 text-gray-600">Tenant:</span>
              <span class="flex-1">{{ request.tenant_name }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Description:</span>
              <span class="flex-1">{{ request.description }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Submitted:</span>
              <span class="flex-1">{{ formatDate(request.created_at) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium w-32 text-gray-600">Last Updated:</span>
              <span class="flex-1">{{ formatDate(request.updated_at) }}</span>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="flex flex-wrap gap-3">
            <template v-if="request.status === 'pending'">
              <button
                  @click="updateRequestStatus(request.request_id, 'in_progress')"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Mark In Progress
              </button>
              <button
                  @click="updateRequestStatus(request.request_id, 'cancelled')"
                  class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Cancel Request
              </button>
            </template>

            <template v-else-if="request.status === 'in_progress'">
              <button
                  @click="updateRequestStatus(request.request_id, 'resolved')"
                  class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Mark Resolved
              </button>
              <button
                  @click="updateRequestStatus(request.request_id, 'pending')"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Revert to Pending
              </button>
            </template>

            <template v-else-if="request.status === 'resolved'">
              <button
                  @click="updateRequestStatus(request.request_id, 'in_progress')"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Reopen
              </button>
            </template>

            <template v-else-if="request.status === 'cancelled'">
              <button
                  @click="updateRequestStatus(request.request_id, 'pending')"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded font-medium text-sm transition-all duration-200"
              >
                Reactivate
              </button>
            </template>
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