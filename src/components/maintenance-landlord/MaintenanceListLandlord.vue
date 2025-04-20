<script setup>
import { computed } from 'vue';
import MaintenanceCardLandlord from './MaintenanceCardLandlord.vue';

const props = defineProps({
  requests: {
    type: Array,
    required: true
  },
  selectedStatus: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update-status']);

const filteredRequests = computed(() => {
  if (props.selectedStatus === 'all') return props.requests;
  return props.requests.filter(req => req.status === props.selectedStatus);
});
</script>

<template>
  <div v-if="filteredRequests.length > 0" class="grid gap-6">
    <MaintenanceCardLandlord
        v-for="request in filteredRequests"
        :key="request.requestId"
        :request="request"
        @update-status="(id, status) => emit('update-status', id, status)"
    />
  </div>

  <div v-else class="bg-white rounded-lg shadow p-8 text-center">
    <div class="text-5xl mb-4 opacity-50">🔧</div>
    <h3 class="text-lg font-medium text-gray-800 mb-2">No maintenance requests found</h3>
    <p class="text-gray-600">
      There are no {{ selectedStatus === 'all' ? '' : selectedStatus.toLowerCase().replace('_', ' ') + ' ' }}requests at this time.
    </p>
  </div>
</template>