<script setup>
import { useAdminDashboardStore } from '@/stores/adminDashboardStore.js'
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import LeaseTerminationModal from '@/components/admin/dashboard/LeaseTerminationModal.vue'
import PendingLeasesModal from '@/components/admin/dashboard/PendingLeasesModal.vue'
import PendingPropertiesModal from '@/components/admin/dashboard/PendingPropertiesModal.vue'

const store = useAdminDashboardStore()

onMounted(() => {
  store.initDashboard()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <!-- Header with dashboard title and subtle gradient background -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg">
      <div class="px-8 py-6">
        <h1 class="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p class="text-indigo-100 mt-1">Manage properties, leases and approvals</p>
      </div>
    </div>

    <!-- Action Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Terminate Leases Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div class="bg-red-100 px-6 py-4">
          <h3 class="text-red-800 font-semibold">Lease Termination</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4 text-sm">Manage and process lease termination requests</p>
          <button
              @click="store.openTerminationModal"
              class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Terminate Leases</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Accept Properties Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div class="bg-blue-100 px-6 py-4">
          <h3 class="text-blue-800 font-semibold">Property Approvals</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4 text-sm">Review and accept pending property listings</p>
          <button
              @click="store.openPendingPropertiesModal"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Accept Properties</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Approve Leases Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div class="bg-green-100 px-6 py-4">
          <h3 class="text-green-800 font-semibold">Lease Approvals</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4 text-sm">Review and approve pending lease requests</p>
          <button
              @click="store.openPendingLeasesModal"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Approve Leases</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-indigo-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Active Leases</h3>
            <p class="font-bold text-xl text-gray-800">{{ store.stats?.activeLeases || 0 }}</p>
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
            <h3 class="text-gray-500 text-sm">Pending Approvals</h3>
            <p class="font-bold text-xl text-gray-800">{{ store.stats?.pendingApprovals || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Monthly Revenue</h3>
            <p class="font-bold text-xl text-gray-800">{{ store.stats?.monthlyRevenue || '$0' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Total Users</h3>
            <p class="font-bold text-xl text-gray-800">{{ store.stats?.totalUsers || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ratings Link Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-yellow-100 px-6 py-4">
        <h3 class="text-yellow-800 font-semibold">Landlord Ratings</h3>
      </div>
      <div class="p-6">
        <p class="text-gray-600 mb-4">Access and manage landlord ratings and reviews</p>
        <router-link
            to="/admin/ratings"
            class="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
        >
          <span>View Landlord Ratings</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Chart Section with improved styling -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Lease Activity Trends</h2>
        <div class="flex gap-2">
          <button class="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">Monthly</button>
          <button class="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500 font-medium">Quarterly</button>
          <button class="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500 font-medium">Yearly</button>
        </div>
      </div>
      <div class="p-6">
        <div class="h-[400px]">
          <Chart type="bar" :data="store.leaseChartData" :options="store.leaseChartOptions" class="w-full h-full" />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <LeaseTerminationModal
        :visible="store.showTerminateModal"
        :leases="store.pendingLeaseTerminations"
        :loading="store.loading"
        @update:visible="store.showTerminateModal = $event"
        @approve="store.approveTermination"
        @reject="store.rejectTermination"
    />

    <PendingLeasesModal
        :visible="store.showPendingLeasesModal"
        :leases="store.pendingLeaseApprovals"
        :loading="store.loading"
        @update:visible="store.showPendingLeasesModal = $event"
        @approve="store.approveLease"
        @reject="store.rejectLease"
    />

    <PendingPropertiesModal
        :visible="store.showPendingPropertiesModal"
        :properties="store.pendingProperties"
        :loading="store.loading"
        @update:visible="store.showPendingPropertiesModal = $event"
    />
  </div>
</template>