<script setup>
const props = defineProps({
  rentPaymentsLastMonth: Number,
  occupancyRate: Number,
  vacantUnits: Number,
  maintenanceCostThisMonth: Number
})
</script>

<template>
  <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Monthly Summary</h2>
    <div class="space-y-4">
      <div class="p-4 bg-green-50 rounded-lg">
        <p class="text-sm text-green-700">Collected Rent</p>
        <p class="text-2xl font-bold">${{ rentPaymentsLastMonth.toLocaleString() }}</p>
        <p class="text-xs text-green-600">Past 30 days</p>
      </div>
      <div class="p-4 bg-purple-50 rounded-lg">
        <p class="text-sm text-purple-700">Occupancy Rate</p>
        <p class="text-2xl font-bold">{{ occupancyRate }}%</p>
        <p class="text-xs text-purple-600">{{ vacantUnits }} units available</p>
      </div>
      <div class="p-4 bg-orange-50 rounded-lg">
        <p class="text-sm text-orange-700">Maintenance Costs</p>
        <p class="text-2xl font-bold">${{ maintenanceCostThisMonth.toLocaleString() }}</p>
        <p class="text-xs text-orange-600">Past 30 days</p>
      </div>
    </div>
  </section>
</template>

