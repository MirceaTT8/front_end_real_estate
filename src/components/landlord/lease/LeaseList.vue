<script setup>
import {
  getPropertyNameByLeaseId,
  getTenantNameByLeaseId
} from '@/utils/leaseNameUtils';

import {requestLeaseTermination} from "@/services/leaseService.js";

defineProps({
  leases: {
    type: Array,
    required: true
  },
  statusColors: {
    type: Object,
    required: true
  },
  properties: {
    type: Array,
    required: true
  },
  tenants: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['terminate']);

const formatDate = (dateString) => {
  if (!dateString || dateString === 'undetermined') return 'undetermined';
  return new Date(dateString).toLocaleDateString();
};

const handleTerminate = async (leaseId) => {
  try {
    await requestLeaseTermination(leaseId); // 🔁 Call the backend API
    emit('terminate', leaseId); // 🔁 Notify parent to refresh or update list
  } catch (error) {
    console.error('Termination request failed:', error);
    alert('Failed to request lease termination.');
  }
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
            {{ getPropertyNameByLeaseId(lease.leaseId, leases, properties) }}
          </router-link>
        </div>

        <div>
          <span class="block text-sm text-gray-500 mb-1">Tenant:</span>
          <router-link
              :to="`/tenants/${lease.tenantId}`"
              class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {{ getTenantNameByLeaseId(lease.leaseId, leases, tenants) }}
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

        <div
            v-if="lease.terminationStatus === 'PENDING'"
            class="text-orange-600 font-medium px-4 py-2 rounded-md bg-orange-100"
        >
          Termination Requested
        </div>

        <div
            v-else-if="lease.terminationStatus === 'APPROVED'"
            class="text-green-700 font-medium px-4 py-2 rounded-md bg-green-100"
        >
          Termination Approved
        </div>

        <button
            v-else-if="lease.status === 'ACTIVE'"
            @click="handleTerminate(lease.leaseId)"
            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Terminate
        </button>
      </div>


    </div>
  </div>
</template>
