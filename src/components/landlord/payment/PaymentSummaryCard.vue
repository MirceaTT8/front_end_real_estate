<script setup>
import { computed } from 'vue'

const props = defineProps({
  payments: {
    type: Array,
    default: () => []
  }
})

const totalAmount = computed(() =>
    props.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
)

const completedCount = computed(() =>
    props.payments.filter(p => p.status === 'COMPLETED').length
)

const pendingCount = computed(() =>
    props.payments.filter(p => p.status !== 'COMPLETED').length
)
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div class="bg-green-100 text-green-800 p-4 rounded shadow text-center">
      <p class="text-sm font-medium">Total Collected</p>
      <p class="text-xl font-bold">${{ totalAmount.toFixed(2) }}</p>
    </div>
    <div class="bg-blue-100 text-blue-800 p-4 rounded shadow text-center">
      <p class="text-sm font-medium">Completed Payments</p>
      <p class="text-xl font-bold">{{ completedCount }}</p>
    </div>
    <div class="bg-yellow-100 text-yellow-800 p-4 rounded shadow text-center">
      <p class="text-sm font-medium">Pending Payments</p>
      <p class="text-xl font-bold">{{ pendingCount }}</p>
    </div>
  </div>
</template>
