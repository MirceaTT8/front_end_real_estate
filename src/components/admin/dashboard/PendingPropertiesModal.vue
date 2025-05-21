<template>
  <Dialog
      :visible="visible"
      modal
      :header="false"
      class="w-full max-w-2xl rounded-xl shadow-lg overflow-hidden"
      @update:visible="$emit('update:visible', $event)"
  >
    <!-- Custom Header -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 class="text-xl font-semibold text-white">Pending Properties</h2>
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
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading pending properties...</p>
    </div>

    <!-- Content -->
    <div v-else class="p-6">
      <div v-if="properties.length > 0" class="space-y-4">
        <div
            v-for="property in properties"
            :key="property.id"
            class="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm"
        >
          <div class="bg-blue-50 px-5 py-3 border-b border-blue-200 flex justify-between items-center">
            <div class="flex items-center">
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                {{ property.status }}
              </span>
              <h3 class="font-semibold text-blue-900">Property #{{ property.id }}</h3>
            </div>
          </div>

          <div class="p-5">
            <!-- Property Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <!-- Property Name/Address -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Property Name</p>
                  <p class="font-medium text-gray-900">{{ property.name || property.address || 'Unnamed Property' }}</p>
                </div>
              </div>

              <!-- Owner ID -->
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-500">Owner ID</p>
                  <p class="font-medium text-gray-900">{{ property.ownerId }}</p>
                </div>
              </div>
            </div>

            <div v-if="property.address" class="mb-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">Address</p>
                <p class="font-medium text-gray-900">{{ property.address }}</p>
              </div>
            </div>

            <!-- Status tag at the bottom - optional design element -->
            <div class="mt-4 border-t border-gray-100 pt-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-2" :class="{
                    'bg-yellow-400': property.status === 'PENDING',
                    'bg-green-400': property.status === 'APPROVED',
                    'bg-red-400': property.status === 'REJECTED',
                    'bg-gray-400': !['PENDING', 'APPROVED', 'REJECTED'].includes(property.status)
                  }"></span>
                  <span class="text-sm text-gray-600">Status: {{ property.status }}</span>
                </div>

                <!-- Optional Actions -->
                <div class="flex gap-2">
                  <button class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Pending Properties</h3>
        <p class="text-gray-500">There are no pending properties at this time.</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  properties: Array,
  loading: Boolean
})

defineEmits(['update:visible'])

// Format date to more readable format - if needed
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>