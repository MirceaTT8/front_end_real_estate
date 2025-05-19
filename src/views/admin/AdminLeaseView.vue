<script setup>
import { onMounted, ref } from 'vue'
import { fetchAllLeases } from '@/services/leaseService'

const leases = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    leases.value = await fetchAllLeases()
  } catch (err) {
    error.value = 'Failed to load leases.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📄 Admin Lease Management</h1>

    <div v-if="loading" class="text-gray-500">Loading leases...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="leases.length === 0" class="text-gray-600">No leases found.</div>

    <table v-else class="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left">Lease ID</th>
        <th class="px-4 py-2 text-left">Tenant</th>
        <th class="px-4 py-2 text-left">Property</th>
        <th class="px-4 py-2 text-left">Start Date</th>
        <th class="px-4 py-2 text-left">End Date</th>
        <th class="px-4 py-2 text-left">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="lease in leases" :key="lease.leaseId" class="border-t">
        <td class="px-4 py-2">{{ lease.leaseId }}</td>
        <td class="px-4 py-2">{{ lease.tenantId || 'N/A' }}</td>
        <td class="px-4 py-2">{{ lease.propertyId || 'N/A' }}</td>
        <td class="px-4 py-2">{{ new Date(lease.startDate).toLocaleDateString() }}</td>
        <td class="px-4 py-2">{{ new Date(lease.endDate).toLocaleDateString() }}</td>
        <td class="px-4 py-2">{{ lease.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th, td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
