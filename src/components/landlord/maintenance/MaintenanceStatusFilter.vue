<script setup>
const props = defineProps({
  selectedStatus: {
    type: String,
    required: true
  },
  availableStatuses: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selectedStatus']);
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <label class="font-medium text-gray-700 text-sm">Filter by status:</label>
    <select
        :value="selectedStatus"
        @change="$emit('update:selectedStatus', $event.target.value)"
        class="py-2 px-4 border border-gray-300 rounded-md min-w-48 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="all">All Requests</option>
      <option
          v-for="status in ['PENDING', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED']"
          :key="status"
          :value="status"
          :disabled="!availableStatuses.includes(status)"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ status.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, l => l.toUpperCase()) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
option:disabled {
  @apply text-gray-400 bg-gray-50;
}
</style>
