<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Maintenance Requests</h1>

    <div v-if="loading" class="text-gray-500">Loading maintenance requests...</div>
    <div v-else-if="requests.length === 0" class="text-gray-600">No maintenance requests found.</div>

    <table v-else class="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left">Request ID</th>
        <th class="px-4 py-2 text-left">Lease ID</th>
        <th class="px-4 py-2 text-left">Description</th>
        <th class="px-4 py-2 text-left">Status</th>
        <th class="px-4 py-2 text-left">Created</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="request in requests" :key="request.id" class="border-t">
        <td class="px-4 py-2">{{ request.id }}</td>
        <td class="px-4 py-2">{{ request.leaseId }}</td>
        <td class="px-4 py-2">{{ request.description }}</td>
        <td class="px-4 py-2">{{ request.status }}</td>
        <td class="px-4 py-2">{{ new Date(request.createdAt).toLocaleDateString() }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAllMaintenanceRequests } from "@/services/maintenanceService.js";

const loading = ref(true)
const requests = ref([])

onMounted(async () => {
  try {
    requests.value = await fetchAllMaintenanceRequests()
  } catch (error) {
    console.error('Failed to load maintenance requests:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
th, td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
