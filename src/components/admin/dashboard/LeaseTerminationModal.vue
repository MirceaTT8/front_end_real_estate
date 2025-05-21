<template>
  <Dialog
      :visible="visible"
      modal
      :header="false"
      class="w-full max-w-2xl rounded-xl shadow-lg overflow-hidden"
      @update:visible="$emit('update:visible', $event)"
  >
    <!-- Custom Header -->
    <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <h2 class="text-xl font-semibold text-white">Lease Termination Requests</h2>
      </div>
      <button
          @click="$emit('update:visible', false)"
          class="text-white/80 hover:text-white transition-colors focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center p-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading termination requests...</p>
    </div>

    <!-- Content -->
    <div v-else class="p-6">
      <div v-if="leases.length > 0" class="space-y-5">
        <div
            v-for="lease in leases"
            :key="lease.leaseId"
            class="bg-white border border-red-200 rounded-lg overflow-hidden shadow-sm"
        >
          <!-- Lease Header -->
          <div class="bg-red-50 px-5 py-3 border-b border-red-200 flex justify-between items-center">
            <div class="flex items-center">
              <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                Termination Request
              </span>
              <h3 class="font-semibold text-red-900">Lease #{{ lease.leaseId }}</h3>
            </div>
            <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
              {{ lease.terminationStatus }}
            </span>
          </div>

          <!-- Lease Details -->
          <div class="p-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <!-- Tenant Info -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Tenant ID</p>
                  <p class="font-medium text-gray-900">{{ lease.tenantId }}</p>
                </div>
              </div>

              <!-- Property Info -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Property ID</p>
                  <p class="font-medium text-gray-900">{{ lease.propertyId }}</p>
                </div>
              </div>

              <!-- Lease Dates -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Lease Period</p>
                  <p class="font-medium text-gray-900">{{ formatDate(lease.startDate) }} - {{ formatDate(lease.endDate) }}</p>
                </div>
              </div>

              <!-- Monthly Rent -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Monthly Rent</p>
                  <p class="font-medium text-gray-900">${{ lease.monthlyRent }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-end mt-6">
              <button
                  @click="$emit('reject', lease.leaseId)"
                  class="px-4 py-2 bg-white hover:bg-gray-50 text-red-600 font-medium border border-red-600 rounded-lg transition-colors"
              >
                Reject Request
              </button>
              <button
                  @click="$emit('approve', lease.leaseId)"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approve Termination
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Termination Requests</h3>
        <p class="text-gray-500">There are no pending lease termination requests at this time.</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  leases: Array,
  loading: Boolean
})

defineEmits(['update:visible', 'approve', 'reject'])

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>