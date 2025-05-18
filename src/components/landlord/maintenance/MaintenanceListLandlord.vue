<script setup>
import { computed } from 'vue';
import MaintenanceCardLandlord from './MaintenanceCardLandlord.vue';

const props = defineProps({
  requests: Array,
  selectedStatus: String,
  leases: Array,
  tenants: Array,
  properties: Array
})


const emit = defineEmits(['update-status']);

const filteredRequests = computed(() => {
  if (props.selectedStatus === 'all') return props.requests;
  return props.requests.filter(req => req.status === props.selectedStatus);
});
</script>

<template>
  <div v-if="filteredRequests.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <MaintenanceCardLandlord
        v-for="request in filteredRequests"
        :key="request.requestId"
        :request="request"
        :leases="leases"
        :tenants="tenants"
        :properties="properties"
        @update-status="(id, status) => emit('update-status', id, status)"
    />

  </div>

  <div v-else class="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden p-8 text-center">
    <div class="flex justify-center mb-6">
      <div class="bg-gray-100 p-5 rounded-full">
        <span class="text-4xl">🔧</span>
      </div>
    </div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">No maintenance requests</h3>
    <p class="text-gray-500">
      There {{ selectedStatus === 'all' ? "aren't any" : "are no" }}
      {{ selectedStatus === 'all' ? '' : selectedStatus.toLowerCase().replace('_', ' ') + ' ' }}
      requests at this time.
    </p>
  </div>
</template>