<script setup>
import { formatCurrency } from '@/utils/formatters';

defineProps({
  currentBalance: {
    type: Number,
    required: true
  },
  monthlyRent: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div
      class="mb-8 bg-white rounded-lg p-6 shadow-md border-l-4"
      :class="currentBalance === 0 ? 'border-green-500' : 'border-orange-400'"
  >
    <h3 class="text-gray-500 text-sm font-medium">Rent Due</h3>
    <p class="text-3xl font-bold text-gray-800 my-2">
      {{ formatCurrency(currentBalance) }}
    </p>
    <p class="text-gray-600 font-medium">
      {{ currentBalance === 0 ? 'Rent paid for this month' : `Due by the 5th of each month (${formatCurrency(monthlyRent)})` }}
    </p>
  </div>
</template>