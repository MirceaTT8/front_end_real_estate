<script setup>
import {
  getPropertyNameByLeaseId,
  getTenantNameByLeaseId
} from '@/utils/leaseNameUtils';

import { requestLeaseTermination } from "@/services/leaseService.js";

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
    await requestLeaseTermination(leaseId);
    emit('terminate', leaseId);
  } catch (error) {
    console.error('Termination request failed:', error);
    alert('Failed to request lease termination.');
  }
};
</script>

<template>
  <div class="space-y-8">
    <div
        v-for="lease in leases"
        :key="lease.leaseId"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
    >
      <!-- Header Section with Gradient Background -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span class="font-bold">{{ lease.leaseId }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">
              Lease Agreement
              <span
                  :class="[statusColors[lease.status].bg, statusColors[lease.status].text]"
                  class="ml-2 px-3 py-1 rounded-full text-xs font-medium capitalize inline-flex items-center"
              >
                <span class="w-2 h-2 rounded-full bg-current mr-1"></span>
                {{ lease.status.toLowerCase() }}
              </span>
            </h3>
          </div>
          <div class="text-right">
            <span class="text-sm text-gray-500">Monthly Rent</span>
            <div class="text-xl font-bold text-blue-700">${{ lease.monthlyRent }}</div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Property Card -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-blue-50">
            <span class="block text-sm text-gray-500 mb-2">Property</span>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <router-link
                  :to="`/properties/${lease.propertyId}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {{ getPropertyNameByLeaseId(lease.leaseId, leases, properties) }}
              </router-link>
            </div>
          </div>

          <!-- Tenant Card -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-blue-50">
            <span class="block text-sm text-gray-500 mb-2">Tenant</span>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <router-link
                  :to="`/tenants/${lease.tenantId}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {{ getTenantNameByLeaseId(lease.leaseId, leases, tenants) }}
              </router-link>
            </div>
          </div>

          <!-- Duration Card -->
          <div class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-blue-50">
            <span class="block text-sm text-gray-500 mb-2">Duration</span>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-medium">
                {{ formatDate(lease.startDate) }} - {{ formatDate(lease.endDate) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">

          <div
              v-if="lease.terminationStatus === 'PENDING'"
              class="flex items-center text-orange-600 font-medium px-4 py-2 rounded-md bg-orange-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Termination Requested
          </div>

          <div
              v-else-if="lease.terminationStatus === 'APPROVED'"
              class="flex items-center text-green-700 font-medium px-4 py-2 rounded-md bg-green-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Termination Approved
          </div>

          <button
              v-else-if="lease.status === 'ACTIVE'"
              @click="handleTerminate(lease.leaseId)"
              class="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Terminate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>