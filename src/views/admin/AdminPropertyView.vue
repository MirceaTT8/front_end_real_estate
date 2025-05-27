<script setup>
import { onMounted } from 'vue'
import { useAdminPropertyStore } from '@/stores/adminPropertyStore'

const store = useAdminPropertyStore()

// Status badge styling
const getStatusStyle = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800 border border-gray-200'
    case 'MAINTENANCE':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'RENTED':
      return 'bg-purple-100 text-purple-800 border border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

// Dot indicator styling
const getStatusDot = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500'
    case 'PENDING':
      return 'bg-yellow-500'
    case 'INACTIVE':
      return 'bg-gray-500'
    case 'MAINTENANCE':
      return 'bg-blue-500'
    case 'RENTED':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

// Retry loading on error
const retryLoading = async () => {
  await store.loadProperties()
}

onMounted(() => {
  store.loadProperties()
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
            <button
                @click="store.refresh"
                :disabled="store.loading"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Stats cards with more metrics -->
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
            <p class="font-bold text-xl text-gray-800">{{ store.totalProperties }}</p>
            <p class="text-xs text-gray-500">Portfolio size</p>
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
            <p class="font-bold text-xl text-gray-800">{{ store.activeProperties }}</p>
            <p class="text-xs text-gray-500">{{ store.occupancyRate }}% occupancy rate</p>
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
            <p class="font-bold text-xl text-gray-800">{{ store.pendingProperties }}</p>
            <p class="text-xs text-gray-500">Awaiting approval</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Average Rent</h3>
            <p class="font-bold text-xl text-gray-800">${{ store.averageRent.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">Per month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Find Properties</h2>
          <p class="text-sm text-gray-500">Search and filter your property portfolio</p>
        </div>
        <button
            @click="store.clearFilters"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear Filters
        </button>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  v-model="store.selectedStatus"
                  class="block w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              >
                <option v-for="status in store.statuses" :key="status" :value="status">
                  {{ status === 'ALL' ? 'All Statuses' : status }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

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
                  v-model="store.searchQuery"
                  type="text"
                  placeholder="Search by name, address or ID"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-lg">Loading properties...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex items-center justify-center">
        <div class="bg-red-100 border border-red-200 rounded-lg p-4 w-full max-w-2xl">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ store.error }}</p>
              <button
                  @click="retryLoading"
                  class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.filteredProperties.length === 0" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <p class="text-gray-600 font-medium mb-1">No properties found</p>
        <p class="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
        <button
            @click="store.clearFilters"
            class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Property Cards -->
    <div v-else>
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Property Directory</h2>
            <p class="text-sm text-gray-500">{{ store.filteredProperties.length }} properties found</p>
          </div>
          <div class="flex gap-2">
            <button
                v-if="store.selectedProperties.size > 0"
                @click="store.bulkApproveProperties"
                class="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve Selected ({{ store.selectedProperties.size }})
            </button>
            <button
                v-if="store.selectedProperties.size > 0"
                @click="store.bulkRejectProperties"
                class="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject Selected ({{ store.selectedProperties.size }})
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="property in store.filteredProperties"
            :key="property.propertyId"
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
                <h2 class="text-lg font-semibold text-gray-800 leading-tight">{{ property.name || property.title }}</h2>
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

            <!-- Property metrics -->
            <div class="border-t border-gray-100 pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Property ID</p>
                  <p class="text-sm font-medium text-gray-700">{{ property.propertyId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Monthly Rent</p>
                  <p class="text-sm font-medium text-gray-700">${{ property.rentAmount?.toLocaleString() || 'N/A' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p class="text-xs text-gray-500">Type</p>
                  <p class="text-sm font-medium text-gray-700">{{ property.type || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Validation Status</p>
                  <p class="text-sm font-medium" :class="{
                    'text-green-600': property.validationStatus === 'APPROVED',
                    'text-yellow-600': property.validationStatus === 'PENDING',
                    'text-red-600': property.validationStatus === 'REJECTED',
                    'text-gray-600': !property.validationStatus
                  }">
                    {{ property.validationStatus || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="border-t border-gray-100 pt-4 space-y-2">
              <!-- Approval buttons for pending properties -->
              <div v-if="property.validationStatus === 'PENDING'" class="flex gap-2">
                <button
                    @click="store.approveProperty(property.propertyId)"
                    class="flex-1 text-xs font-medium bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                    @click="store.rejectProperty(property.propertyId)"
                    class="flex-1 text-xs font-medium bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>

              <!-- View details link -->
              <router-link
                  :to="{ name: 'PropertyDetails', params: { id: property.propertyId } }"
                  class="block text-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors py-2"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>