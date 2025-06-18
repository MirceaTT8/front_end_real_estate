<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTenantRatingsStore } from '@/stores/admin/adminTenantRatingsStore.js'

const store = useTenantRatingsStore()
const sortBy = ref('overallScore')
const sortDirection = ref('desc')

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'desc'
  }
}

const sortedTenants = computed(() => {
  return store.getSortedTenants(sortBy.value, sortDirection.value)
})

const getScoreColor = (score) => {
  if (score >= 4.5) return 'text-green-600'
  if (score >= 3.5) return 'text-blue-600'
  if (score >= 2.5) return 'text-yellow-600'
  return 'text-red-600'
}

const getPaymentHistoryColor = (history) => {
  if (history === 'Excellent' || history === 'Good') return 'text-green-600'
  if (history === 'Fair') return 'text-yellow-600'
  return 'text-red-600'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleRefresh = async () => {
  await store.refreshRatings()
}

onMounted(() => {
  store.fetchRatings()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tenant Ratings Overview</h1>
        <p class="text-gray-500 mt-1">Payment scores and performance metrics for all tenants</p>
      </div>

      <!-- Controls -->
      <div class="flex gap-3">
        <button
            @click="handleRefresh"
            :disabled="store.loading"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" :class="{ 'animate-spin': store.loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ store.loading ? 'Refreshing...' : 'Refresh' }}
        </button>

        <button class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="store.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm text-red-700">{{ store.error }}</span>
      </div>
    </div>

    <!-- Stats Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Average Overall Score</p>
        <p class="text-2xl font-bold text-blue-600">
          {{ store.averageOverallScore.toFixed(2) }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Average Payment Score</p>
        <p class="text-2xl font-bold text-green-600">
          {{ store.averagePaymentScore.toFixed(2) }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Top Rated Tenant</p>
        <p class="text-xl font-bold text-gray-800 truncate">
          {{ store.topRatedTenant }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Total Tenants</p>
        <p class="text-2xl font-bold text-gray-800">
          {{ store.totalTenants }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p class="text-sm font-medium text-gray-500 mb-1">Total Late Payments</p>
        <p class="text-2xl font-bold text-red-600">
          {{ store.totalLatePayments }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading && !sortedTenants.length" class="bg-white rounded-xl shadow-md p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading tenant ratings...</p>
    </div>

    <!-- Main Table -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">Tenant Performance Metrics</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th @click="toggleSort('tenantId')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Tenant ID
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('overallScore')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Overall Score
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('paymentScore')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Payment Score
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('punctualityScore')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Punctuality Score
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('feedbackScore')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Feedback Score
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('totalPayments')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Total Payments
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th @click="toggleSort('latePayments')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                Late Payments
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment History
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Payment
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tenant in sortedTenants" :key="tenant.tenantId" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">#{{ tenant.tenantId }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getScoreColor(tenant.overallScore)" class="text-sm font-semibold">
                  {{ (tenant.overallScore || 0).toFixed(1) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getScoreColor(tenant.paymentScore)" class="text-sm font-semibold">
                  {{ (tenant.paymentScore || 0).toFixed(1) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getScoreColor(tenant.punctualityScore)" class="text-sm font-semibold">
                  {{ (tenant.punctualityScore || 0).toFixed(1) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getScoreColor(tenant.feedbackScore)" class="text-sm font-semibold">
                  {{ (tenant.feedbackScore || 0).toFixed(1) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ tenant.totalPayments || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium" :class="tenant.latePayments > 0 ? 'text-red-600' : 'text-gray-900'">
                  {{ tenant.latePayments || 0 }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium" :class="getPaymentHistoryColor(tenant.paymentHistory)">
                {{ tenant.paymentHistory }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(tenant.lastPaymentDate) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!sortedTenants.length && !store.loading" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p class="mt-1 text-sm text-gray-500">There are no tenant ratings to display at this time.</p>
        <button
            @click="handleRefresh"
            class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Try Refreshing
        </button>
      </div>
    </div>
  </div>
</template>