<template>
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr class="text-xs font-semibold text-gray-500 uppercase text-left">
        <th class="px-6 py-3 cursor-pointer" @click="$emit('sort', 'createdAt')">Timestamp</th>
        <th class="px-6 py-3 cursor-pointer" @click="$emit('sort', 'userId')">User ID</th>
        <th class="px-6 py-3 cursor-pointer" @click="$emit('sort', 'actionType')">Action</th>
        <th class="px-6 py-3 cursor-pointer" @click="$emit('sort', 'entityType')">Entity</th>
        <th class="px-6 py-3 cursor-pointer" @click="$emit('sort', 'entityId')">Entity ID</th>
        <th class="px-6 py-3">Details</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
      <LogTableRow v-for="log in logs" :key="log.id" :log="log" />
      </tbody>
    </table>
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
