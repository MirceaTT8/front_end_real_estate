<script setup>
import { computed } from 'vue'
import { useLogStore } from '@/stores/admin/logStore.js'

const logStore = useLogStore()

const hasActiveFilters = computed(() => {
  return logStore.filters.actionType !== '' ||
      logStore.filters.entityType !== '' ||
      logStore.filters.userId !== '' ||
      logStore.filters.dateRange !== 'all'
})

const activeFilterCount = computed(() => {
  let count = 0
  if (logStore.filters.actionType) count++
  if (logStore.filters.entityType) count++
  if (logStore.filters.userId) count++
  if (logStore.filters.dateRange !== 'all') count++
  return count
})

const applyFilters = () => {
  logStore.applyFilters()
}

const resetFilters = () => {
  logStore.resetFilters()
}

const getDateRangeLabel = (range) => {
  const labels = {
    'today': 'Today',
    'week': 'This Week',
    'month': 'This Month',
    'all': 'All Time'
  }
  return labels[range] || range
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filter Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label for="actionType" class="block text-sm font-medium text-gray-700 mb-2">
          Action Type
        </label>
        <select
            id="actionType"
            v-model="logStore.filters.actionType"
            @change="logStore.updateFilter('actionType', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All Actions</option>
          <option
              v-for="actionType in logStore.uniqueActionTypes"
              :key="actionType"
              :value="actionType"
          >
            {{ actionType }}
          </option>
        </select>
      </div>

      <div>
        <label for="entityType" class="block text-sm font-medium text-gray-700 mb-2">
          Entity Type
        </label>
        <select
            id="entityType"
            v-model="logStore.filters.entityType"
            @change="logStore.updateFilter('entityType', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All Entities</option>
          <option
              v-for="entityType in logStore.uniqueEntityTypes"
              :key="entityType"
              :value="entityType"
          >
            {{ entityType }}
          </option>
        </select>
      </div>

      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
          User ID
        </label>
        <select
            id="userId"
            v-model="logStore.filters.userId"
            @change="logStore.updateFilter('userId', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All Users</option>
          <option
              v-for="userId in logStore.uniqueUserIds"
              :key="userId"
              :value="userId"
          >
            User {{ userId }}
          </option>
        </select>
      </div>

      <div>
        <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <select
            id="dateRange"
            v-model="logStore.filters.dateRange"
            @change="logStore.updateFilter('dateRange', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
      <button
          @click="applyFilters"
          class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Apply Filters
      </button>

      <button
          @click="resetFilters"
          class="inline-flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset Filters
      </button>

      <div v-if="hasActiveFilters" class="flex items-center text-sm text-gray-600 ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ activeFilterCount }} filter(s) active</span>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span
          v-if="logStore.filters.actionType"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        Action: {{ logStore.filters.actionType }}
        <button
            @click="logStore.updateFilter('actionType', '')"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>

      <span
          v-if="logStore.filters.entityType"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
      >
        Entity: {{ logStore.filters.entityType }}
        <button
            @click="logStore.updateFilter('entityType', '')"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>

      <span
          v-if="logStore.filters.userId"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      >
        User: {{ logStore.filters.userId }}
        <button
            @click="logStore.updateFilter('userId', '')"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>

      <span
          v-if="logStore.filters.dateRange !== 'all'"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
      >
        Date: {{ getDateRangeLabel(logStore.filters.dateRange) }}
        <button
            @click="logStore.updateFilter('dateRange', 'all')"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>
