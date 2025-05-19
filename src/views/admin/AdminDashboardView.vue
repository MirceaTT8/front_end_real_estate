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
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

    <section class="bg-white p-6 rounded shadow flex flex-wrap gap-4">
      <button @click="store.openTerminationModal" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Terminate Leases
      </button>
      <button @click="store.openPendingPropertiesModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Accept Pending Properties
      </button>
      <button @click="store.openPendingLeasesModal" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Approve Pending Leases
      </button>
    </section>

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

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded shadow" v-for="(value, key) in store.kpiMetrics" :key="key">
        <p class="text-sm text-gray-500">{{ key }}</p>
        <p class="text-2xl font-bold">{{ value }}</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Lease Trends</h2>
      <div class="h-[300px]">
        <Chart type="bar" :data="store.leaseChartData" :options="store.leaseChartOptions" class="w-full h-full" />
      </div>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Top Rated Landlords</h2>
      <ul class="divide-y">
        <li v-for="landlord in store.landlordRatings" :key="landlord.name" class="py-2 flex justify-between">
          <span>{{ landlord.name }}</span>
          <span class="font-medium">⭐ {{ landlord.rating.toFixed(1) }}</span>
        </li>
      </ul>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <ul class="divide-y">
        <li v-for="(activity, index) in store.recentActivities" :key="index" class="py-2">
          <p class="text-gray-800">{{ activity.action }}</p>
          <p class="text-sm text-gray-500">By {{ activity.user }} on {{ activity.date }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
