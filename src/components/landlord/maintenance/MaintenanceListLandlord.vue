<script setup>
import { computed } from 'vue';
import MaintenanceCardLandlord from './MaintenanceCardLandlord.vue';

const props = defineProps({
  requests: Array,
  selectedStatus: String,
  leases: Array,
  tenants: Array,
  properties: Array
})

const emit = defineEmits(['update-status']);

const filteredRequests = computed(() => {
  if (props.selectedStatus === 'all') return props.requests;
  return props.requests.filter(req => req.status === props.selectedStatus);
});

// Status mapping for display and styling
const statusMap = {
  'PENDING': { label: 'pending', icon: '⏳' },
  'IN_PROGRESS': { label: 'in progress', icon: '🔧' },
  'COMPLETED': { label: 'completed', icon: '✅' },
  'CANCELLED': { label: 'cancelled', icon: '❌' },
  'all': { label: '', icon: '📋' }
};

// Get the appropriate status label and icon
const getStatusInfo = (status) => {
  return statusMap[status] || { label: status.toLowerCase().replace('_', ' '), icon: '🔧' };
};
</script>

<template>
  <!-- With Requests -->
  <div v-if="filteredRequests.length > 0">
    <!-- List header with count -->
    <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center">
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
          {{ filteredRequests.length }} {{ filteredRequests.length === 1 ? 'request' : 'requests' }}
        </span>
        <span class="ml-2 text-sm text-gray-500">
          {{ selectedStatus !== 'all' ? `filtered by ${getStatusInfo(selectedStatus).label} status` : 'showing all requests' }}
        </span>
      </div>

      <!-- Optional sorting dropdown -->
      <div class="relative">
        <select
            class="text-sm border-gray-300 rounded-md py-1 pl-3 pr-8 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
        >
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Priority: High to Low</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Request cards grid -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6">
      <MaintenanceCardLandlord
          v-for="request in filteredRequests"
          :key="request.requestId"
          :request="request"
          :leases="leases"
          :tenants="tenants"
          :properties="properties"
          @update-status="(id, status) => emit('update-status', id, status)"
      />
    </div>

    <!-- Pagination controls - optional -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </button>
        <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(filteredRequests.length, 10) }}</span> of <span class="font-medium">{{ filteredRequests.length }}</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              1
            </button>
            <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="p-8 flex flex-col items-center justify-center">
    <div class="bg-gray-50 rounded-full p-6 mb-6 border border-gray-100 shadow-inner">
      <span class="text-5xl">{{ getStatusInfo(selectedStatus).icon }}</span>
    </div>

    <h3 class="text-xl font-semibold text-gray-800 mb-2">No maintenance requests</h3>

    <p class="text-gray-600 text-center max-w-md mb-6">
      There {{ selectedStatus === 'all' ? "aren't any" : "are no" }}
      {{ selectedStatus === 'all' ? '' : getStatusInfo(selectedStatus).label }}
      maintenance requests at this time.
    </p>

    <!-- Optional action button -->
    <button
        v-if="selectedStatus !== 'all'"
        @click="$emit('update:selectedStatus', 'all')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      View all requests
    </button>
  </div>
</template>