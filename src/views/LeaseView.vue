<script setup>
import { ref, onMounted, computed } from 'vue'
import { createPayment} from "@/services/paymentService.js";
// Mock data - replace with your actual API calls
const leases = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('active')

const fetchActiveLeasesByOwnerId = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          leaseId: 1,
          tenantId: 2,
          tenantName: 'Jane Smith',
          propertyId: 2,
          propertyName: 'Downtown Loft',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 1800.00,
          status: 'active'
        },
        {
          leaseId: 2,
          tenantId: 3,
          tenantName: 'Mike Johnson',
          propertyId: 1,
          propertyName: 'Sunset Apartments',
          startDate: '2024-02-15',
          endDate: '2024-12-31',
          monthlyRent: 1200.00,
          status: 'active'
        },
        {
          leaseId: 3,
          tenantId: 4,
          tenantName: 'Sarah Williams',
          propertyId: 3,
          propertyName: 'Lakeside Villa',
          startDate: '2023-06-01',
          endDate: '2023-12-31',
          monthlyRent: 2000.00,
          status: 'terminated'
        }
      ])
    }, 800)
  })
}


// Initialize data
onMounted(async () => {
  try {
    leases.value = await fetchActiveLeasesByOwnerId()
  } catch (err) {
    error.value = err.message || 'Failed to load leases'
  } finally {
    loading.value = false
  }
})

// Computed properties
const filteredLeases = computed(() => {
  return leases.value.filter(lease =>
      activeTab.value === 'all' ||
      lease.status === activeTab.value
  )
})

const totalMonthlyRent = computed(() => {
  return leases.value
      .filter(l => l.status === 'active')
      .reduce((sum, lease) => sum + lease.monthlyRent, 0)
})

const statusColors = {
  active: { bg: 'bg-green-50', text: 'text-green-600' },
  terminated: { bg: 'bg-red-50', text: 'text-red-600' },
  pending: { bg: 'bg-orange-50', text: 'text-orange-600' }
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-gray-600 text-sm font-medium mb-1">Total Leases</h3>
          <p class="text-2xl font-bold text-gray-800">{{ leases.length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-gray-600 text-sm font-medium mb-1">Active Leases</h3>
          <p class="text-2xl font-bold text-gray-800">{{ leases.filter(l => l.status === 'active').length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 class="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</h3>
          <p class="text-2xl font-bold text-gray-800">${{ totalMonthlyRent.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Lease Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
            @click="activeTab = 'active'"
            :class="{ 'text-green-600 border-b-2 border-green-600': activeTab === 'active' }"
            class="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          Active
        </button>
        <button
            @click="activeTab = 'terminated'"
            :class="{ 'text-red-600 border-b-2 border-red-600': activeTab === 'terminated' }"
            class="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          Terminated
        </button>
        <button
            @click="activeTab = 'all'"
            :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 'all' }"
            class="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          All Leases
        </button>
      </div>

      <!-- Lease List -->
      <div v-if="filteredLeases.length > 0" class="space-y-6">
        <div
            v-for="lease in filteredLeases"
            :key="lease.leaseId"
            class="bg-white p-6 rounded-lg shadow-sm"
        >
          <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Lease #{{ lease.leaseId }}
              <span
                  :class="[statusColors[lease.status].bg, statusColors[lease.status].text]"
                  class="px-3 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ lease.status }}
              </span>
            </h3>
            <span class="text-lg font-bold text-gray-800">${{ lease.monthlyRent }}/month</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <span class="block text-sm text-gray-500 mb-1">Property:</span>
              <router-link
                  :to="`/properties/${lease.propertyId}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {{ lease.propertyName || `Property #${lease.propertyId}` }}
              </router-link>
            </div>

            <div>
              <span class="block text-sm text-gray-500 mb-1">Tenant:</span>
              <router-link
                  :to="`/tenants/${lease.tenantId}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {{ lease.tenantName || `Tenant #${lease.tenantId}` }}
              </router-link>
            </div>

            <div>
              <span class="block text-sm text-gray-500 mb-1">Duration:</span>
              <span class="font-medium">
                {{ new Date(lease.startDate).toLocaleDateString() }} -
                {{ new Date(lease.endDate).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <router-link
                :to="`/leases/${lease.leaseId}`"
                class="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md transition-colors"
            >
              View Details
            </router-link>
            <button
                v-if="lease.status === 'active'"
                @click="handleTerminate(lease.leaseId)"
                class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Terminate
            </button>
          </div>
        </div>
      </div>

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