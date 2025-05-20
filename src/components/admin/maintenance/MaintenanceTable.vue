<script setup>
defineProps({
  requests: Array,
  sortField: String,
  sortDirection: String
})

const emit = defineEmits(['sort', 'view-images'])

const columns = [
  { label: 'Request ID', key: 'requestId' },
  { label: 'Lease ID', key: 'leaseId' },
  { label: 'Description', key: 'description' },
  { label: 'Status', key: 'status' },
  { label: 'Cost', key: 'cost' },
  { label: 'Created', key: 'createdAt' }
]
</script>

<template>
  <table class="min-w-full bg-white border border-gray-200 rounded shadow">
    <thead class="bg-gray-100">
    <tr>
      <th
          v-for="col in columns"
          :key="col.key"
          @click="emit('sort', col.key)"
          class="px-4 py-2 text-left cursor-pointer"
      >
        {{ col.label }}
        <span v-if="sortField === col.key">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
      </th>
      <th class="px-4 py-2 text-left">Review</th>
      <th class="px-4 py-2 text-left">Images</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="request in requests" :key="request.requestId" class="border-t">
      <td class="px-4 py-2">{{ request.requestId }}</td>
      <td class="px-4 py-2">{{ request.leaseId }}</td>
      <td class="px-4 py-2">{{ request.description }}</td>
      <td class="px-4 py-2">{{ request.status }}</td>
      <td class="px-4 py-2">{{ request.cost != null ? `$${request.cost.toFixed(2)}` : '—' }}</td>
      <td class="px-4 py-2">{{ new Date(request.createdAt).toLocaleDateString() }}</td>
      <td class="px-4 py-2 text-green-600 font-medium">Good</td>
      <td class="px-4 py-2">
        <button
            v-if="request.imageUrls?.length"
            @click="emit('view-images', request.imageUrls)"
            class="text-blue-600 underline text-sm hover:text-blue-800"
        >
          View Images
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>
