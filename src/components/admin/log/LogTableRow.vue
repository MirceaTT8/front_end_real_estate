<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-600">{{ formatDate(log.createdAt) }}</td>
    <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-900">{{ log.userId }}</td>
    <td class="px-6 py-3 whitespace-nowrap">
      <span
          class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
          :class="getActionColor(log.actionType)"
      >
        {{ log.actionType }}
      </span>
    </td>
    <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-700">{{ log.entityType }}</td>
    <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-700">{{ log.entityId }}</td>
    <td class="px-6 py-3 text-xs whitespace-pre-wrap text-gray-500 max-w-xs truncate">
      {{ log.details }}
    </td>
  </tr>
</template>


<script setup>
const props = defineProps({ log: Object })

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

function getActionColor(actionType) {
  if (actionType.includes('CREATE')) return 'bg-green-500'
  if (actionType.includes('UPDATE')) return 'bg-blue-500'
  if (actionType.includes('DELETE')) return 'bg-red-500'
  return 'bg-gray-400'
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
