<script setup>
import { onMounted } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboardStore.js'

const store = useAdminDashboardStore()

onMounted(() => {
  store.fetchLandlordRatings()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Landlord Ratings Overview</h1>

    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="min-w-full text-sm text-left border-separate border-spacing-y-2">
        <thead class="text-gray-600 bg-gray-50">
        <tr>
          <th class="px-4 py-3">Name</th>
          <th class="px-4 py-3">Email</th>
          <th class="px-4 py-3">Overall Score</th>
          <th class="px-4 py-3">Rating Score</th>
          <th class="px-4 py-3">Maintenance Score</th>
          <th class="px-4 py-3">Behavior Score</th>
          <th class="px-4 py-3">Completed Leases</th>
          <th class="px-4 py-3">Avg Response Time (hrs)</th>
          <th class="px-4 py-3">Flagged Properties</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="landlord in store.landlordRatingsDetailed"
            :key="landlord.landlordId"
            class="bg-white hover:bg-gray-50 transition"
        >
          <td class="px-4 py-2 font-medium text-gray-800">{{ landlord.name }}</td>
          <td class="px-4 py-2 text-gray-500">{{ landlord.email }}</td>
          <td class="px-4 py-2 font-semibold text-blue-700">{{ landlord.overallScore.toFixed(2) }}</td>
          <td class="px-4 py-2">⭐ {{ landlord.ratingScore.toFixed(1) }}</td>
          <td class="px-4 py-2">{{ landlord.maintenanceScore.toFixed(1) }}</td>
          <td class="px-4 py-2">{{ landlord.behaviorScore.toFixed(1) }}</td>
          <td class="px-4 py-2">{{ landlord.completedLeases }}</td>
          <td class="px-4 py-2">{{ landlord.avgMaintenanceResponseTime }}</td>
          <td class="px-4 py-2 text-red-600">{{ landlord.flaggedProperties }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
