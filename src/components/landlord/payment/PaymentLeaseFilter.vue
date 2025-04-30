<script setup>
const props = defineProps(['leases', 'selectedLease', 'getPropertyName', 'getTenantName'])
const emit = defineEmits(['update:selectedLease'])
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <label class="font-medium text-gray-700">Filter by Lease:</label>
    <select
        :value="selectedLease"
        @change="emit('update:selectedLease', $event.target.value ? Number($event.target.value) : null)"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[300px]"
    >
      <option :value="null">All Leases</option>
      <option
          v-for="lease in leases"
          :key="lease.leaseId"
          :value="lease.leaseId"
      >
        {{ getPropertyName(lease.propertyId) }} - {{ getTenantName(lease.tenantId) }}
      </option>
    </select>
  </div>
</template>
