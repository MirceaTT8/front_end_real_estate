<script setup>
import { computed } from 'vue'

const props = defineProps({
  payments: {
    type: Array,
    default: () => []
  },
  selectedLeaseId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:selectedLeaseId'])

const leaseOptions = computed(() => {
  const unique = new Map()
  props.payments.forEach(p => {
    if (!unique.has(p.leaseId)) {
      unique.set(p.leaseId, `Lease #${p.leaseId}`)
    }
  })
  return Array.from(unique, ([value, label]) => ({ value, label }))
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