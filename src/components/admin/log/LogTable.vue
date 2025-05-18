<template>
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table v-if="logs.length" class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th @click="$emit('sort', 'createdAt')" class="sortable">Timestamp</th>
        <th>User ID</th>
        <th @click="$emit('sort', 'actionType')" class="sortable">Action</th>
        <th @click="$emit('sort', 'entityType')" class="sortable">Entity</th>
        <th>Entity ID</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <LogTableRow v-for="log in logs" :key="log.id" :log="log" />
      </tbody>
    </table>
    <div v-else class="text-center py-12 bg-white">
      <p class="text-gray-500">No activity logs found matching your filters.</p>
    </div>
  </div>
</template>

<script setup>
import LogTableRow from './LogTableRow.vue'
defineProps(['logs'])
</script>

<style scoped>
.sortable {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100;
}
</style>
