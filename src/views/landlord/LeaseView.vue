<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchMyLeases } from '@/services/leaseService.js';
import { fetchUserById } from '@/services/userService.js';
import { fetchPropertyById } from '@/services/propertyService.js';
import LeaseList from '@/components/landlord/lease/LeaseList.vue';
import LeaseSummaryCards from '@/components/landlord/lease/LeaseSummaryCards.vue';
import LeaseTabs from '@/components/landlord/lease/LeaseTabs.vue';
import LeaseCreateModal from "@/components/landlord/lease/LeaseCreateModal.vue";
import {createWebHistory as $router} from "vue-router/dist/vue-router.esm-browser.js";

const leases = ref([])
const properties = ref([])
const tenants = ref([])
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

onMounted(async () => {
  await loadLeasesAndRelatedData()
})

const loadLeasesAndRelatedData = async () => {
  loading.value = true;
  try {
    const leaseResults = await fetchMyLeases();
    const propertyResults = await Promise.all(leaseResults.map(lease => fetchPropertyById(lease.propertyId)))
    const tenantResults = await Promise.all(
        leaseResults.map(async lease => {
          if (lease.tenantId) {
            try {
              return await fetchUserById(lease.tenantId);
            } catch (e) {
              console.warn(`Failed to fetch tenant for lease ${lease.leaseId}:`, e);
              return null;
            }
          } else {
            return null;
          }
        })
    )

    leases.value = leaseResults
    properties.value = propertyResults
    tenants.value = tenantResults
  } catch (err) {
    error.value = err.message || 'Failed to load leases'
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

const handleTerminate = (leaseId) => {
  console.log('Terminating lease:', leaseId)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Lease Management</h1>
      <button
          @click="showCreateModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        + Add New Lease
      </button>
    </header>

    <LeaseCreateModal
        v-if="showCreateModal"
        @cancel="showCreateModal = false"
        @success="() => {
        showCreateModal = false
        loadLeasesAndRelatedData()
      }"
    />


    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading leases...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg text-center">
      <p class="text-red-600 mb-4">⚠️ {{ error }}</p>
      <button
          @click="$router.go(0)"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>

    <div v-else>
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
          :properties="properties"
          :tenants="tenants"
          :status-colors="STATUS_COLORS"
          @terminate="handleTerminate"
      />

      <div v-else class="bg-white p-12 rounded-lg shadow-sm text-center">
        <div class="text-5xl mb-4 opacity-50">📄</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No leases found</h3>
        <p class="text-gray-600 mb-6">You don't have any {{ activeTab }} leases yet.</p>
      </div>
    </div>
  </div>
</template>
