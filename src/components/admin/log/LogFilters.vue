<template>
  <div class="bg-white shadow-md rounded-lg p-6 space-y-6 mb-6">
    <!-- Filters Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Action Type -->
      <div>
        <label for="actionType" class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
        <select
            id="actionType"
            v-model="filters.actionType"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Actions</option>
          <option v-for="action in uniqueActionTypes" :key="action" :value="action">
            {{ action }}
          </option>
        </select>
      </div>

      <!-- Entity Type -->
      <div>
        <label for="entityType" class="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
        <select
            id="entityType"
            v-model="filters.entityType"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Entities</option>
          <option v-for="entity in uniqueEntityTypes" :key="entity" :value="entity">
            {{ entity }}
          </option>
        </select>
      </div>

      <!-- User ID -->
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
        <select
            id="userId"
            v-model="filters.userId"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Users</option>
          <option v-for="user in uniqueUserIds" :key="user" :value="user">
            {{ user }}
          </option>
        </select>
      </div>

      <!-- Date Range -->
      <div>
        <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <select
            id="dateRange"
            v-model="filters.dateRange"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-2 border-t border-gray-200">
      <button
          @click="$emit('reset')"
          class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm transition"
      >
        <span class="mr-2">🔄</span> Reset
      </button>
      <button
          @click="$emit('apply')"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white border border-transparent rounded-md shadow-sm transition"
      >
        <span class="mr-2">🎯</span> Apply
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue';

const filters = reactive({
  actionType: '',
  entityType: '',
  userId: '',
  dateRange: 'all'
});

const uniqueActionTypes = ['Created', 'Updated', 'Deleted'];
const uniqueEntityTypes = ['User', 'Property', 'Lease'];
const uniqueUserIds = [1, 2, 3, 4];
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

</style>
