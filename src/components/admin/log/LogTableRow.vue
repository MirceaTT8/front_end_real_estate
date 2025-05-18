<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(log.createdAt) }}</td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.userId }}</td>
    <td class="px-6 py-4 whitespace-nowrap text-sm">
      <span :class="getActionClass(log.actionType)" class="px-2 py-1 rounded-full text-xs font-semibold text-white">
        {{ log.actionType }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.entityType }}</td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.entityId }}</td>
    <td class="px-6 py-4 text-sm text-gray-500">
      <div v-if="log.details" class="max-w-xs overflow-hidden overflow-ellipsis">{{ formatDetails(log.details) }}</div>
      <span v-else>-</span>
    </td>
  </tr>
</template>

<script setup>
defineProps(['log'])

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

function getActionClass(actionType) {
  if (actionType.includes('CREATE')) return 'bg-green-500'
  if (actionType.includes('UPDATE')) return 'bg-blue-500'
  if (actionType.includes('DELETE')) return 'bg-red-500'
  return 'bg-gray-500'
}

function formatDetails(details) {
  try {
    const parsed = JSON.parse(details)
    return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ')
  } catch {
    return details
  }
}
</script>
