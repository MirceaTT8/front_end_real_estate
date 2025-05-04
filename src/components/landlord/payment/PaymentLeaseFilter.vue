<script setup>
import { computed } from 'vue'

const props = defineProps({
  payments: Array,
  leases: Array,
  selectedLeaseId: Number
})

const emit = defineEmits(['update:selectedLeaseId'])

const leaseOptions = computed(() => {
  const leaseMap = new Map()
  props.leases.forEach(lease => {
    leaseMap.set(lease.leaseId, lease)
  })

  const seen = new Set()
  return props.payments
      .filter(p => !seen.has(p.leaseId) && seen.add(p.leaseId))
      .map(p => {
        const lease = leaseMap.get(p.leaseId)
        const label = lease && lease.property && lease.property.name
            ? lease.property.name
            : `Lease #${p.leaseId}`
        return { value: p.leaseId, label }
      })
})
</script>

<template>
  <div class="mb-6 flex justify-end">
    <select
        class="border rounded p-2 text-gray-700"
        :value="selectedLeaseId === null ? '' : selectedLeaseId"
        @change="e => emit('update:selectedLeaseId', e.target.value ? parseInt(e.target.value) : null)"
    >
      <option value="">All Leases</option>
      <option
          v-for="option in leaseOptions"
          :key="option.value"
          :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
