<script setup>
defineProps({
  leases: {
    type: Array,
    required: true
  },
  statusColors: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['terminate']);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const handleTerminate = (leaseId) => {
  emit('terminate', leaseId);
};
</script>

<template>
  <div class="space-y-6">
    <div
        v-for="lease in leases"
        :key="lease.leaseId"
        class="bg-white p-6 rounded-lg shadow-sm"
    >
      <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Lease #{{ lease.leaseId }}
          <span
              :class="[statusColors[lease.status].bg, statusColors[lease.status].text]"
              class="px-3 py-1 rounded-full text-xs font-medium capitalize"
          >
            {{ lease.status.toLowerCase() }}
          </span>
        </h3>
        <span class="text-lg font-bold text-gray-800">${{ lease.monthlyRent }}/month</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <span class="block text-sm text-gray-500 mb-1">Property:</span>
          <router-link
              :to="`/properties/${lease.propertyId}`"
              class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {{ lease.propertyName || `Property #${lease.propertyId}` }}
          </router-link>
        </div>

        <div>
          <span class="block text-sm text-gray-500 mb-1">Tenant:</span>
          <router-link
              :to="`/tenants/${lease.tenantId}`"
              class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {{ lease.tenantName || `Tenant #${lease.tenantId}` }}
          </router-link>
        </div>

        <div>
          <span class="block text-sm text-gray-500 mb-1">Duration:</span>
          <span class="font-medium">
            {{ formatDate(lease.startDate) }} - {{ formatDate(lease.endDate) }}
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <router-link
            :to="`/leases/${lease.leaseId}`"
            class="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md transition-colors"
        >
          View Details
        </router-link>
        <button
            v-if="lease.status === 'ACTIVE'"
            @click="handleTerminate(lease.leaseId)"
            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Terminate
        </button>
      </div>
    </div>
  </div>
</template>