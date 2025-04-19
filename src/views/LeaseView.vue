<script setup>
import { ref, onMounted, computed } from 'vue'
import {fetchActiveLeasesByOwnerId} from "@/services/leaseService.js";
import LeaseList from "@/components/lease/LeaseList.vue";
import LeaseSummaryCards from "@/components/lease/LeaseSummaryCards.vue";
import LeaseTabs from "@/components/lease/LeaseTabs.vue";
const leases = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('ACTIVE')

onMounted(async () => {
  try {
    leases.value = await fetchActiveLeasesByOwnerId(1)
    console.log(leases.value)
  } catch (err) {
    error.value = err.message || 'Failed to load leases'
  } finally {
    loading.value = false
  }
})

const STATUS_COLORS = {
  ACTIVE: { bg: 'bg-green-50', text: 'text-green-600' },
  TERMINATED: { bg: 'bg-red-50', text: 'text-red-600' },
  PENDING: { bg: 'bg-orange-50', text: 'text-orange-600' }
}


const filteredLeases = computed(() => {
  return activeTab.value === 'all'
      ? leases.value
      : leases.value.filter(lease => lease.status === activeTab.value)
})
const totalMonthlyRent = computed(() => {
  return leases.value
      .filter(l => l.status === 'ACTIVE')
      .reduce((sum, lease) => sum + lease.monthlyRent, 0)
})

const activeLeasesCount = computed(() => {
  return leases.value.filter(l => l.status.toUpperCase() === 'ACTIVE').length
})

const statusColors = {
  ACTIVE: { bg: 'bg-green-50', text: 'text-green-600' },
  TERMINATED: { bg: 'bg-red-50', text: 'text-red-600' },
  PENDING: { bg: 'bg-orange-50', text: 'text-orange-600' }
}
const handleTerminate = (leaseId) => {
  console.log('Terminating lease:', leaseId)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Lease Management</h1>
      <router-link
          to="/leases/new"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        + Add New Lease
      </router-link>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading leases...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg text-center">
      <p class="text-red-600 mb-4">⚠️ {{ error }}</p>
      <button
          @click="$router.go(0)"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Summary Cards -->
      <LeaseSummaryCards
          :total-leases="leases.length"
          :active-leases="activeLeasesCount"
          :monthly-revenue="totalMonthlyRent"
      />

      <LeaseTabs
          v-model:active-tab="activeTab"
          :tabs="[
          { value: 'ACTIVE', label: 'Active' },
          { value: 'TERMINATED', label: 'Terminated' },
          { value: 'all', label: 'All Leases' }
        ]"
      />

      <LeaseList
          v-if="filteredLeases.length > 0"
          :leases="filteredLeases"
          :status-colors="STATUS_COLORS"
          @terminate="handleTerminate"
      />


      <!-- Empty State -->
      <div v-else class="bg-white p-12 rounded-lg shadow-sm text-center">
        <div class="text-5xl mb-4 opacity-50">📄</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No leases found</h3>
        <p class="text-gray-600 mb-6">You don't have any {{ activeTab }} leases yet.</p>
        <router-link
            to="/leases/new"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors inline-block"
        >
          Create New Lease
        </router-link>
      </div>
    </div>
  </div>
</template>