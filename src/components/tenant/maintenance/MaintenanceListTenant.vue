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
  <div v-if="loading" class="flex flex-col items-center justify-center space-y-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
    <p class="text-gray-600">Loading your requests...</p>
  </div>

  <div v-else-if="error" class="text-center text-red-600">
    <p>⚠️ {{ error }}</p>
    <button
        @click="$emit('retry')"
        class="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
    >
      Try Again
    </button>
  </div>

  <div class="p-4 max-w-xl mx-auto">
    <div v-if="requests.length === 0" class="text-center text-gray-500 mt-10">
      <p>No maintenance requests found.</p>
    </div>
    <div v-else class="space-y-4">
      <MaintenanceCardTenant
          v-for="request in requests"
          :key="request.requestId"
          :request="request"
      />
    </div>
  </div>
</template>