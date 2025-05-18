
<script setup>
import { ref, computed, onMounted } from 'vue'
import LogFilters from "@/components/admin/log/LogFilters.vue";
import LogTable from "@/components/admin/log/LogTable.vue";
import { fetchAllLogs } from '@/services/logsService'

const logs = ref([])
const loading = ref(false)
const error = ref(null)
const sortField = ref('createdAt')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = 20

const filters = ref({
  actionType: '',
  entityType: '',
  userId: '',
  dateRange: 'all'
})

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
    if (filters.value.actionType && log.actionType !== filters.value.actionType) return false
    if (filters.value.entityType && log.entityType !== filters.value.entityType) return false
    if (filters.value.userId && log.userId !== parseInt(filters.value.userId)) return false

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

const sortedFilteredLogs = computed(() => {
  return [...filteredLogs.value].sort((a, b) => {
    const fieldA = a[sortField.value]
    const fieldB = b[sortField.value]
    if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.ceil(sortedFilteredLogs.value.length / pageSize))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedFilteredLogs.value.slice(start, start + pageSize)
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const applyFilters = () => {
  currentPage.value = 1
}
const resetFilters = () => {
  filters.value = {
    actionType: '',
    entityType: '',
    userId: '',
    dateRange: 'all'
  }
  currentPage.value = 1
}

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
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Activity Logs</h1>

    <LogFilters @reset="resetFilters" @apply="applyFilters">
      <template #filters>
        <div>
          <label for="actionType" class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
          <select id="actionType" v-model="filters.actionType" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Actions</option>
            <option v-for="action in uniqueActionTypes" :key="action" :value="action">
              {{ action }}
            </option>
          </select>
        </div>

        <div>
          <label for="entityType" class="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
          <select id="entityType" v-model="filters.entityType" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Entities</option>
            <option v-for="entity in uniqueEntityTypes" :key="entity" :value="entity">
              {{ entity }}
            </option>
          </select>
        </div>

        <div>
          <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <select id="userId" v-model="filters.userId" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Users</option>
            <option v-for="user in uniqueUserIds" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>

        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select id="dateRange" v-model="filters.dateRange" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </template>
    </LogFilters>

    <LogTable :logs="paginatedLogs" @sort="sortBy" />

    <div v-if="totalPages > 1" class="flex justify-center mt-6 space-x-2">
      <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 rounded-md border text-sm font-medium"
          :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>
