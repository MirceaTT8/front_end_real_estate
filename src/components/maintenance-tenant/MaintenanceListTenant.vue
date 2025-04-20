<script setup>
import MaintenanceCardTenant from './MaintenanceCardTenant.vue'

defineProps({
  requests: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, null],
    default: null
  },
  statusFilter: {
    type: String,
    required: true
  }
})

defineEmits(['create-new', 'retry'])
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex flex-col items-center justify-center space-y-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
    <p class="text-gray-600">Loading your requests...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="text-center text-red-600">
    <p>⚠️ {{ error }}</p>
    <button
        @click="$emit('retry')"
        class="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
    >
      Try Again
    </button>
  </div>

  <!-- Empty State -->
  <div v-else-if="requests.length === 0" class="text-center text-gray-600">
    <p v-if="statusFilter === 'ALL'">You haven't submitted any maintenance requests yet.</p>
    <p v-else>No {{ statusFilter.toLowerCase() }} requests found.</p>
    <button
        @click="$emit('create-new')"
        class="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
    >
      Create New Request
    </button>
  </div>

  <!-- Request Cards -->
  <div v-else class="space-y-6">
    <MaintenanceCardTenant
        v-for="request in requests"
        :key="request.requestId"
        :request="request"
    />
  </div>
</template>