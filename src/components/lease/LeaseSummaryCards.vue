<script setup>
defineProps({
  totalLeases: {
    type: Number,
    required: true
  },
  activeLeases: {
    type: Number,
    required: true
  },
  monthlyRevenue: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-gray-600 text-sm font-medium mb-1">Total Leases</h3>
      <p class="text-2xl font-bold text-gray-800">{{ totalLeases }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-gray-600 text-sm font-medium mb-1">Active Leases</h3>
      <p class="text-2xl font-bold text-gray-800">{{ activeLeases }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
      <h3 class="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</h3>
      <p class="text-2xl font-bold text-gray-800">${{ monthlyRevenue.toLocaleString() }}</p>
    </div>
  </div>
</template>