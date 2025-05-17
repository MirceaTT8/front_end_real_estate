<template>
  <Dialog :visible="visible" modal header="Lease Termination Requests" class="w-full max-w-2xl rounded-xl shadow-lg" @update:visible="$emit('update:visible', $event)">
    <div v-if="loading" class="text-center py-6 text-gray-500">Loading termination requests...</div>

    <div v-else-if="leases.length > 0" class="space-y-4">
      <div v-for="lease in leases" :key="lease.leaseId" class="p-4 border rounded bg-red-50 space-y-2">
        <p class="font-semibold text-red-900">Tenant ID: {{ lease.tenantId }}</p>
        <p class="text-sm text-gray-600">Property ID: {{ lease.propertyId }}</p>
        <p class="text-sm text-gray-600">Start Date: {{ lease.startDate }}</p>
        <p class="text-sm text-gray-600">End Date: {{ lease.endDate }}</p>
        <p class="text-sm text-gray-600">Monthly Rent: ${{ lease.monthlyRent }}</p>
        <p class="text-sm text-gray-500 italic">Termination Status: {{ lease.terminationStatus }}</p>

        <div class="flex gap-2">
          <button @click="$emit('approve', lease.leaseId)" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
          <button @click="$emit('reject', lease.leaseId)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 py-8">
      <p>No termination requests found.</p>
    </div>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  leases: Array,
  loading: Boolean
})

defineEmits(['update:visible', 'approve', 'reject'])
</script>
