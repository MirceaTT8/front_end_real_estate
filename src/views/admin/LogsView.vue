<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h1>

    <!-- Logs Table -->
    <div class="overflow-x-auto shadow-md rounded-lg">
      <table v-if="logs.length > 0" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th @click="sortBy('createdAt')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
            Timestamp
            <span v-if="sortField === 'createdAt'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User ID
          </th>
          <th @click="sortBy('actionType')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
            Action
            <span v-if="sortField === 'actionType'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
          </th>
          <th @click="sortBy('entityType')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
            Entity
            <span v-if="sortField === 'entityType'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Entity ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Details
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="log in sortedLogs" :key="log.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(log.createdAt) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ log.userId }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="getActionClass(log.actionType)" class="px-2 py-1 rounded-full text-xs font-semibold text-white">
                {{ log.actionType }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ log.entityType }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ log.entityId }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500">
            <div v-if="log.details" class="max-w-xs overflow-hidden overflow-ellipsis">
              {{ formatDetails(log.details) }}
            </div>
            <span v-else>-</span>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12 bg-white">
        <p class="text-gray-500">No activity logs found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAllLogs } from '@/services/logsService'

// Reactive state
const logs = ref([])
const loading = ref(false)
const error = ref(null)
const sortField = ref('createdAt')
const sortDirection = ref('desc')

// Computed properties
const sortedLogs = computed(() => {
  return [...logs.value].sort((a, b) => {
    const fieldA = a[sortField.value]
    const fieldB = b[sortField.value]

    if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const formatDetails = (details) => {
  try {
    const parsed = JSON.parse(details)
    return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ')
  } catch {
    return details
  }
}

const getActionClass = (actionType) => {
  if (actionType.includes('CREATE')) return 'bg-green-500'
  if (actionType.includes('UPDATE')) return 'bg-blue-500'
  if (actionType.includes('DELETE')) return 'bg-red-500'
  return 'bg-gray-500'
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Lifecycle hook
onMounted(async () => {
  try {
    loading.value = true
    logs.value = await fetchAllLogs()
  } catch (err) {
    error.value = 'Failed to fetch logs'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>