<script setup>
import { ref } from 'vue'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import {
  approveLeaseTermination,
  fetchPendingLeaseTerminations,
  fetchPendingLeases,
  approveLease,
  rejectLease, decideLeaseTermination
} from '@/services/leaseService'
import { fetchPendingProperties } from '@/services/propertyService'
import LeaseTerminationModal from "@/components/admin/dashboard/LeaseTerminationModal.vue";
import PendingLeasesModal from "@/components/admin/dashboard/PendingLeasesModal.vue";
import PendingPropertiesModal from "@/components/admin/dashboard/PendingPropertiesModal.vue";

const showTerminateModal = ref(false)
const showPendingLeasesModal = ref(false)
const showPendingPropertiesModal = ref(false)
const pendingLeases = ref([])
const pendingLeaseApprovals = ref([])
const pendingProperties = ref([])
const isLoading = ref(false)

const openTerminationModal = async () => {
  showTerminateModal.value = true
  isLoading.value = true
  try {
    pendingLeases.value = await fetchPendingLeaseTerminations()
  } catch (err) {
    console.error('Error fetching leases:', err)
  } finally {
    isLoading.value = false
  }
}

const openPendingLeasesModal = async () => {
  showPendingLeasesModal.value = true
  isLoading.value = true
  try {
    pendingLeaseApprovals.value = await fetchPendingLeases()
  } catch (err) {
    console.error('Error fetching pending leases:', err)
  } finally {
    isLoading.value = false
  }
}

const openPendingPropertiesModal = async () => {
  showPendingPropertiesModal.value = true
  isLoading.value = true
  try {
    pendingProperties.value = await fetchPendingProperties()
  } catch (err) {
    console.error('Error fetching pending properties:', err)
  } finally {
    isLoading.value = false
  }
}

const terminateLease = async (id) => {
  try {
    await decideLeaseTermination(id, 'APPROVED');
    pendingLeases.value = pendingLeases.value.filter(lease => lease.leaseId !== id);
  } catch (err) {
    console.error('Failed to approve lease termination:', err);
    alert('Failed to approve termination. Please try again.');
  }
};

const rejectTerminationRequest = async (id) => {
  try {
    await decideLeaseTermination(id, 'REJECTED');
    pendingLeases.value = pendingLeases.value.filter(lease => lease.leaseId !== id);
  } catch (err) {
    console.error('Failed to reject lease termination:', err);
    alert('Failed to reject termination. Please try again.');
  }
};



const approvePendingLease = async (id) => {
  try {
    await approveLease(id)
    pendingLeaseApprovals.value = pendingLeaseApprovals.value.filter(lease => lease.leaseId !== id)
  } catch (err) {
    console.error('Failed to approve lease:', err)
    alert('Failed to approve lease. Please try again.')
  }
}

const rejectPendingLease = async (id) => {
  try {
    await rejectLease(id)
    pendingLeaseApprovals.value = pendingLeaseApprovals.value.filter(lease => lease.leaseId !== id)
  } catch (err) {
    console.error('Failed to reject lease:', err)
    alert('Failed to reject lease. Please try again.')
  }
}

const recentActivities = ref([
  { action: 'New lease created', user: 'landlord_john', date: '2024-05-07' },
  { action: 'Maintenance request resolved', user: 'landlord_emily', date: '2024-05-06' },
  { action: 'New tenant registered', user: 'tenant_lisa', date: '2024-05-05' }
])

const landlordRatings = ref([
  { name: 'John Smith', rating: 4.5 },
  { name: 'Emily Davis', rating: 4.8 },
  { name: 'Michael Lee', rating: 4.1 }
])

const analytics = ref({
  totalUsers: 250,
  activeLandlords: 45,
  activeTenants: 93,
  totalProperties: 162,
  rentedProperties: 115,
  totalLeases: 128,
  avgRent: 1200,
  totalPayments: 93600,
  pendingRequests: 8,
  avgResolutionTime: 2.5
})

const leaseChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'New Leases',
      backgroundColor: '#4F46E5',
      data: [12, 19, 9, 14, 16]
    },
    {
      label: 'Terminated Leases',
      backgroundColor: '#F87171',
      data: [3, 5, 2, 4, 1]
    }
  ]
})

const leaseChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

</script>
<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

    <section class="bg-white p-6 rounded shadow flex flex-wrap gap-4">
      <button @click="openTerminationModal" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Terminate Leases
      </button>
      <button @click="openPendingPropertiesModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Accept Pending Properties
      </button>
      <button @click="openPendingLeasesModal" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Approve Pending Leases
      </button>
    </section>

    <LeaseTerminationModal
        :visible="showTerminateModal"
        :leases="pendingLeases"
        :loading="isLoading"
        @update:visible="showTerminateModal = $event"
        @approve="terminateLease"
        @reject="rejectTerminationRequest"
    />

    <PendingLeasesModal
        :visible="showPendingLeasesModal"
        :leases="pendingLeaseApprovals"
        :loading="isLoading"
        @update:visible="showPendingLeasesModal = $event"
        @approve="approvePendingLease"
        @reject="rejectPendingLease"
    />

    <PendingPropertiesModal
        :visible="showPendingPropertiesModal"
        :properties="pendingProperties"
        :loading="isLoading"
        @update:visible="showPendingPropertiesModal = $event"
    />


    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded shadow" v-for="(value, key) in {
        'Total Users': analytics.totalUsers,
        'Active Landlords': analytics.activeLandlords,
        'Active Tenants': analytics.activeTenants,
        'Total Properties': analytics.totalProperties,
        'Rented Properties': analytics.rentedProperties,
        'Total Leases': analytics.totalLeases,
        'Avg. Monthly Rent': `$${analytics.avgRent}`,
        'Total Payments': `$${analytics.totalPayments}`,
        'Pending Maintenance': analytics.pendingRequests,
        'Avg. Maintenance Response': `${analytics.avgResolutionTime} days`
      }" :key="key">
        <p class="text-sm text-gray-500">{{ key }}</p>
        <p class="text-2xl font-bold">{{ value }}</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Lease Trends</h2>
      <div class="h-[300px]">
        <Chart type="bar" :data="leaseChartData" :options="leaseChartOptions" class="w-full h-full" />
      </div>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Top Rated Landlords</h2>
      <ul class="divide-y">
        <li v-for="landlord in landlordRatings" :key="landlord.name" class="py-2 flex justify-between">
          <span>{{ landlord.name }}</span>
          <span class="font-medium">⭐ {{ landlord.rating.toFixed(1) }}</span>
        </li>
      </ul>
    </section>

    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <ul class="divide-y">
        <li v-for="(activity, index) in recentActivities" :key="index" class="py-2">
          <p class="text-gray-800">{{ activity.action }}</p>
          <p class="text-sm text-gray-500">By {{ activity.user }} on {{ activity.date }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>