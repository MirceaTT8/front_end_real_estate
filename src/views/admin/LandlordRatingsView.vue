<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboardStore.js'

const store = useAdminDashboardStore()
const sortBy = ref('overallScore')
const sortDirection = ref('desc')

// Sorting functionality
const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'desc'
  }
}

// Make sure landlordRatingsDetailed is an array before sorting
const sortedLandlords = computed(() => {
  const ratings = store.landlordRatingsDetailed || []
  return [...ratings].sort((a, b) => {
    const modifier = sortDirection.value === 'asc' ? 1 : -1

    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier
    return 0
  })
})

// Score color function based on rating value
const getScoreColor = (score) => {
  if (score >= 4.5) return 'text-green-600'
  if (score >= 3.5) return 'text-blue-600'
  if (score >= 2.5) return 'text-yellow-600'
  return 'text-red-600'
}

// Helper to safely calculate average
const calculateAverage = (array, property) => {
  if (!array || !array.length) return 0
  const sum = array.reduce((acc, item) => acc + (item[property] || 0), 0)
  return sum / array.length
}

// Helper to safely get total
const calculateTotal = (array, property) => {
  if (!array || !array.length) return 0
  return array.reduce((acc, item) => acc + (item[property] || 0), 0)
}

// Helper to safely get top rated
const getTopRated = (array) => {
  if (!array || !array.length) return 'N/A'
  return [...array].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))[0].name || 'N/A'
}

onMounted(() => {
  store.fetchLandlordRatings()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Landlord Ratings Overview</h1>
        <p class="text-gray-500 mt-1">Performance metrics and ratings for all landlords</p>
      </div>

      <!-- Optional: Add export or filter buttons here -->
      <div class="flex gap-3">
        <button class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
<!--        <button class="inline-flex items-center px-4 py-2 bg-blue-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition-colors">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />-->
<!--          </svg>-->
<!--          Export CSV-->
<!--        </button>-->
      </div>
    </div>

    <!-- Stats Summary Cards - Optional but adds value -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Average Overall Score</p>
        <p class="text-2xl font-bold text-blue-600">
          {{ calculateAverage(store.landlordRatingsDetailed, 'overallScore').toFixed(2) }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Top Rated Landlord</p>
        <p class="text-xl font-bold text-gray-800 truncate">
          {{ getTopRated(store.landlordRatingsDetailed) }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Total Landlords</p>
        <p class="text-2xl font-bold text-gray-800">
          {{ store.landlordRatingsDetailed ? store.landlordRatingsDetailed.length : 0 }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Total Flagged Properties</p>
        <p class="text-2xl font-bold text-red-600">
          {{ calculateTotal(store.landlordRatingsDetailed, 'flaggedProperties') }}
        </p>
      </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">Landlord Performance Metrics</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table head and body sections remain unchanged -->
          <!-- ... -->
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!sortedLandlords.length" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p class="mt-1 text-sm text-gray-500">There are no landlord ratings to display at this time.</p>
      </div>
    </div>
  </div>
</template>