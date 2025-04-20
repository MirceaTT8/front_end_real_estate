<script setup>
defineProps({
  request: {
    type: Object,
    required: true
  }
})

const statusDisplay = {
  PENDING: { label: 'Pending', color: 'orange' },
  IN_PROGRESS: { label: 'In Progress', color: 'blue' },
  COMPLETED: { label: 'Completed', color: 'green' }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Request #{{ request.requestId }}</h3>
      <span
          class="text-sm font-medium px-3 py-1 rounded-full"
          :class="{
          'bg-orange-100 text-orange-700': request.status === 'PENDING',
          'bg-blue-100 text-blue-700': request.status === 'IN_PROGRESS',
          'bg-green-100 text-green-700': request.status === 'COMPLETED'
        }"
      >
        {{ statusDisplay[request.status].label }}
      </span>
    </div>

    <p class="text-gray-700 mb-4">{{ request.description }}</p>

    <!-- Attachments -->
    <div v-if="request.imageUrls?.length" class="mb-4">
      <h4 class="font-medium text-gray-700 mb-2">
        Attached Photos ({{ request.imageUrls.length }})
      </h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
            v-for="(imageId, index) in request.imageUrls"
            :key="index"
            class="w-full aspect-square border rounded overflow-hidden"
        >
          <img
              :src="`http://localhost:8080/image/${imageId}`"
              :alt="`Attachment ${index + 1}`"
              class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div class="text-sm text-gray-600 space-y-1">
      <div><span class="font-medium">Submitted:</span> {{ formatDate(request.createdAt) }}</div>
      <div><span class="font-medium">Last Updated:</span> {{ formatDate(request.updatedAt) }}</div>
      <div v-if="request.status === 'completed'">
        <span class="font-medium">Resolution Time:</span> {{ request.resolution_time }} days
      </div>
      <div v-if="request.status === 'completed'">
        <span class="font-medium">Fixed?:</span> {{ request.is_fixed ? 'Yes' : 'No' }}
      </div>
    </div>
  </div>
</template>