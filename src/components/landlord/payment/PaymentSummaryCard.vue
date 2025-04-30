<script setup>
defineProps(['totalCollected', 'expectedMonthly', 'overdueCount', 'formatCurrency'])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-sm font-medium text-gray-500 mb-2">Total Collected</h3>
      <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalCollected) }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-sm font-medium text-gray-500 mb-2">Expected Monthly</h3>
      <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(expectedMonthly) }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-sm font-medium text-gray-500 mb-2">Overdue Payments</h3>
      <p class="text-2xl font-bold text-gray-800">{{ overdueCount }}</p>
    </div>
  </div>
</template>

