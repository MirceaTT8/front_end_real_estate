<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAllLogs } from '@/services/logsService'

// Reactive state
const logs = ref([])
const loading = ref(false)
const error = ref(null)
const sortField = ref('createdAt')
const sortDirection = ref('desc')

// Filters
const filters = ref({
  actionType: '',
  entityType: '',
  userId: '',
  dateRange: 'all'
})

// Computed properties
const uniqueActionTypes = computed(() => {
  const actions = new Set()
  logs.value.forEach(log => actions.add(log.actionType))
  return Array.from(actions).sort()
})

const uniqueEntityTypes = computed(() => {
  const entities = new Set()
  logs.value.forEach(log => entities.add(log.entityType))
  return Array.from(entities).sort()
})

const uniqueUserIds = computed(() => {
  const users = new Set()
  logs.value.forEach(log => users.add(log.userId))
  return Array.from(users).sort((a, b) => a - b)
})

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    // Action Type filter
    if (filters.value.actionType && log.actionType !== filters.value.actionType) {
      return false
    }

    // Entity Type filter
    if (filters.value.entityType && log.entityType !== filters.value.entityType) {
      return false
    }

    // User ID filter
    if (filters.value.userId && log.userId !== parseInt(filters.value.userId)) {
      return false
    }

    // Date Range filter
    const logDate = new Date(log.createdAt)
    const now = new Date()

    switch (filters.value.dateRange) {
      case 'today':
        return logDate.toDateString() === now.toDateString()
      case 'week':
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        return logDate >= startOfWeek
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return logDate >= startOfMonth
      default:
        return true
    }
  })
})

const sortedLogs = computed(() => {
  return [...logs.value].sort((a, b) => {
    const fieldA = a[sortField.value]
    const fieldB = b[sortField.value]

    if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const sortedFilteredLogs = computed(() => {
  return [...filteredLogs.value].sort((a, b) => {
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

const applyFilters = () => {
  // Filters are applied reactively through the computed property
  // This method is here if you need to perform any additional actions when applying filters
}

const resetFilters = () => {
  filters.value = {
    actionType: '',
    entityType: '',
    userId: '',
    dateRange: 'all'
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

<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h1>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Action Type Filter -->
        <div>
          <label for="actionType" class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
          <select
              id="actionType"
              v-model="filters.actionType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option v-for="action in uniqueActionTypes" :key="action" :value="action">
              {{ action }}
            </option>
          </select>
        </div>

        <!-- Entity Type Filter -->
        <div>
          <label for="entityType" class="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
          <select
              id="entityType"
              v-model="filters.entityType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Entities</option>
            <option v-for="entity in uniqueEntityTypes" :key="entity" :value="entity">
              {{ entity }}
            </option>
          </select>
        </div>

        <!-- User ID Filter -->
        <div>
          <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <select
              id="userId"
              v-model="filters.userId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            <option v-for="user in uniqueUserIds" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
              id="dateRange"
              v-model="filters.dateRange"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
        >
          Reset Filters
        </button>
        <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="overflow-x-auto shadow-md rounded-lg">
      <table v-if="filteredLogs.length > 0" class="min-w-full divide-y divide-gray-200">
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
        <tr v-for="log in sortedFilteredLogs" :key="log.id" class="hover:bg-gray-50">
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
        <p class="text-gray-500">No activity logs found matching your filters.</p>
      </div>
    </div>
  </div>
</template>

