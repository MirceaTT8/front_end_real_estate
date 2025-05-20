<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchAllPropertiesAdmin } from '@/services/propertyService'

const properties = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedStatus = ref('ALL')

// Computed properties for dashboard metrics
const totalProperties = computed(() => properties.value.length)
const activeProperties = computed(() => properties.value.filter(p => p.status === 'ACTIVE').length)
const pendingProperties = computed(() => properties.value.filter(p => p.status === 'PENDING').length)
const rentedProperties = computed(() => properties.value.filter(p => p.status === 'RENTED').length)

// Computed property for filtered properties
const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    // Filter by search query
    const matchesSearch = !searchQuery.value ||
        property.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        property.propertyId.toString().includes(searchQuery.value);

    // Filter by status
    const matchesStatus = selectedStatus.value === 'ALL' || property.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

// Status badge styling
const getStatusStyle = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    case 'MAINTENANCE':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'RENTED':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

// Dot indicator styling
const getStatusDot = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500';
    case 'PENDING':
      return 'bg-yellow-500';
    case 'INACTIVE':
      return 'bg-gray-500';
    case 'MAINTENANCE':
      return 'bg-blue-500';
    case 'RENTED':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

onMounted(async () => {
  try {
    properties.value = await fetchAllPropertiesAdmin()
  } catch (err) {
    error.value = 'Failed to load properties.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-slate-600 to-blue-700 rounded-2xl shadow-lg">
      <div class="px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Property Management</h1>
              <p class="text-blue-100 mt-1">Manage your property portfolio</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
                class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Property
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Total Properties</h3>
            <p class="font-bold text-xl text-gray-800">{{ totalProperties }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Active Properties</h3>
            <p class="font-bold text-xl text-gray-800">{{ activeProperties }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-yellow-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Pending Properties</h3>
            <p class="font-bold text-xl text-gray-800">{{ pendingProperties }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 9h6m-6 1a1 1 0 001 1h4a1 1 0 001-1v-1m-6-9a1 1 0 00-1 1v9a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1h-6a1 1 0 00-1 1z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Rented Properties</h3>
            <p class="font-bold text-xl text-gray-800">{{ rentedProperties }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">Find Properties</h2>
        <p class="text-sm text-gray-500">Search and filter your property portfolio</p>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <!-- Search -->
          <div class="sm:col-span-2 space-y-2">
            <label for="search" class="block text-sm font-medium text-gray-700">Search Properties</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, address or ID"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="space-y-2">
            <label for="status" class="block text-sm font-medium text-gray-700">Property Status</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <select
                  id="status"
                  v-model="selectedStatus"
                  class="block w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
                <option value="RENTED">Rented</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-lg">Loading properties...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex items-center justify-center">
        <div class="bg-red-100 border border-red-200 rounded-lg p-4 w-full max-w-2xl">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
              <button class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProperties.length === 0" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <p class="text-gray-600 font-medium mb-1">No properties found</p>
        <p class="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
      </div>
    </div>

    <!-- Property Cards -->
    <div v-else>
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Property Directory</h2>
            <p class="text-sm text-gray-500">{{ filteredProperties.length }} properties found</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="property in filteredProperties"
            :key="property.id"
            class="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
        >
          <!-- Property Image/Placeholder -->
          <div class="h-40 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <!-- Property Details -->
          <div class="p-6 space-y-4">
            <div>
              <div class="flex justify-between items-start mb-1">
                <h2 class="text-lg font-semibold text-gray-800 leading-tight">{{ property.title }}</h2>
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusStyle(property.status)"
                >
                  <span :class="getStatusDot(property.status)" class="w-1.5 h-1.5 mr-1.5 rounded-full"></span>
                  {{ property.status }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ property.address }}</p>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Property ID</p>
                  <p class="text-sm font-medium text-gray-700">{{ property.propertyId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Units</p>
                  <p class="text-sm font-medium text-gray-700">{{ property.unitCount || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-2 pt-2">
              <button class="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">View Details</button>
              <button class="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add any component-specific styles here */
</style>