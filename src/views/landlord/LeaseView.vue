<script setup>
import { ref, onMounted, computed } from 'vue'
import {fetchActiveLeasesByOwnerId, createLease} from "@/services/leaseService.js";
import LeaseList from "@/components/lease/LeaseList.vue";
import LeaseSummaryCards from "@/components/lease/LeaseSummaryCards.vue";
import LeaseTabs from "@/components/lease/LeaseTabs.vue";
const leases = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('ACTIVE')
const showCreateModal = ref(false)

const newLease = ref({
  propertyId: null,
  tenantId: null,
  startDate: '',
  endDate: '',
  monthlyRent: 0,
  status: 'ACTIVE'
})

// Fetch leases on mount
onMounted(async () => {
  await loadLeases()
})

const loadLeases = async () => {
  loading.value = true
  try {
    leases.value = await fetchActiveLeasesByOwnerId(1)
  } catch (err) {
    error.value = err.message || 'Failed to load leases'
  } finally {
    loading.value = false
  }
}

const handleCreateLease = async () => {
  try {
    loading.value = true
    const createdLease = await createLease(newLease.value)
    leases.value.push(createdLease)
    showCreateModal.value = false
    // Reset form
    newLease.value = {
      propertyId: null,
      tenantId: null,
      startDate: '',
      endDate: '',
      monthlyRent: 0,
      status: 'ACTIVE'
    }
  } catch (err) {
    error.value = err.message || 'Failed to create lease'
  } finally {
    loading.value = false
  }
}



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
      <button
          @click="showCreateModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        + Add New Lease
      </button>
    </header>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">Create New Lease</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Property ID</label>
              <input
                  v-model.number="newLease.propertyId"
                  type="number"
                  class="w-full p-2 border rounded"
                  placeholder="Enter property ID"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenant ID</label>
              <input
                  v-model.number="newLease.tenantId"
                  type="number"
                  class="w-full p-2 border rounded"
                  placeholder="Enter tenant ID"
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                    v-model="newLease.startDate"
                    type="date"
                    class="w-full p-2 border rounded"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                    v-model="newLease.endDate"
                    type="date"
                    class="w-full p-2 border rounded"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                <input
                    v-model.number="newLease.monthlyRent"
                    type="number"
                    class="w-full p-2 border rounded"
                    placeholder="0.00"
                >
              </div>

<!--              <div>-->
<!--                <label class="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>-->
<!--                <input-->
<!--                    v-model.number="newLease.depositAmount"-->
<!--                    type="number"-->
<!--                    class="w-full p-2 border rounded"-->
<!--                    placeholder="0.00"-->
<!--                >-->
<!--              </div>-->
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
                @click="showCreateModal = false"
                class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
                @click="handleCreateLease"
                :disabled="loading"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
            >
              {{ loading ? 'Creating...' : 'Create Lease' }}
            </button>
          </div>
        </div>
      </div>
    </div>



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