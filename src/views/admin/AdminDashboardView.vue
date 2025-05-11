<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

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

    <!-- Admin Actions -->
    <section class="bg-white p-6 rounded shadow flex flex-wrap gap-4">
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Terminate Leases
      </button>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Accept New Properties
      </button>
      <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Approve Pending Leases
      </button>
      <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
        View Maintenance Requests
      </button>
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
        View Payments
      </button>
    </section>

    <!-- Analytics Overview -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Total Users</p>
        <p class="text-2xl font-bold">{{ analytics.totalUsers }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Active Landlords</p>
        <p class="text-2xl font-bold">{{ analytics.activeLandlords }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Active Tenants</p>
        <p class="text-2xl font-bold">{{ analytics.activeTenants }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Total Properties</p>
        <p class="text-2xl font-bold">{{ analytics.totalProperties }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Rented Properties</p>
        <p class="text-2xl font-bold">{{ analytics.rentedProperties }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Total Leases</p>
        <p class="text-2xl font-bold">{{ analytics.totalLeases }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Avg. Monthly Rent</p>
        <p class="text-2xl font-bold">${{ analytics.avgRent }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Total Payments</p>
        <p class="text-2xl font-bold">${{ analytics.totalPayments }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Pending Maintenance</p>
        <p class="text-2xl font-bold">{{ analytics.pendingRequests }}</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <p class="text-sm text-gray-500">Avg. Maintenance Response</p>
        <p class="text-2xl font-bold">{{ analytics.avgResolutionTime }} days</p>
      </div>
    </section>

    <!-- Lease Trends Chart -->
    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Lease Trends</h2>
      <div class="h-[300px]">
        <Chart type="bar" :data="leaseChartData" :options="leaseChartOptions" class="w-full h-full" />
      </div>
    </section>

    <!-- Landlord Ratings -->
    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Top Rated Landlords</h2>
      <ul class="divide-y">
        <li v-for="landlord in landlordRatings" :key="landlord.name" class="py-2 flex justify-between">
          <span>{{ landlord.name }}</span>
          <span class="font-medium">⭐ {{ landlord.rating.toFixed(1) }}</span>
        </li>
      </ul>
    </section>

    <!-- Recent Activity -->
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

