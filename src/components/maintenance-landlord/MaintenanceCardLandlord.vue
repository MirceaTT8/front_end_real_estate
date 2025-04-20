<script setup>
defineProps({
  request: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-status']);

const statusDisplay = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-600' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-600' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-600' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-600' }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
      <h3 class="text-lg font-medium m-0">Request #{{ request.requestId }}</h3>
      <span
          class="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize"
          :class="[statusDisplay[request.status].bg, statusDisplay[request.status].text]"
      >
        {{ request.status.replace('_', ' ') }}
      </span>
    </div>

    <div class="grid gap-3 mb-6">
      <div class="flex">
        <span class="font-medium w-32 text-gray-600">Lease:</span>
        <span class="flex-1">{{ request.leaseId }}</span>
      </div>
      <div class="flex">
        <span class="font-medium w-32 text-gray-600">Description:</span>
        <span class="flex-1">{{ request.description }}</span>
      </div>
      <div class="flex">
        <span class="font-medium w-32 text-gray-600">Submitted:</span>
        <span class="flex-1">{{ formatDate(request.createdAt) }}</span>
      </div>
      <div class="flex">
        <span class="font-medium w-32 text-gray-600">Last Updated:</span>
        <span class="flex-1">{{ formatDate(request.updatedAt) }}</span>
      </div>
    </div>

    <!-- Image Attachments -->
    <div v-if="request.imageUrls?.length" class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3">
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
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
      <label class="text-sm font-medium text-gray-700">Change status:</label>
      <select
          :value="request.status"
          @change="emit('update-status', request.requestId, $event.target.value)"
          class="py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  </div>
</template>