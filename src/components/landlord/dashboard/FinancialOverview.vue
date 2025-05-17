<script setup>
import Chart from 'primevue/chart'

const props = defineProps({
  rangeOptions: Array,
  activeRange: String,
  filteredChartData: Object,
  chartOptions: Object
})
</script>

<template>
  <section class="col-span-full bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h2>

    <div class="flex gap-2 mb-4">
      <button
          v-for="range in rangeOptions"
          :key="range.value"
          :disabled="!range.enabled"
          @click="$emit('change-range', range.value)"
          class="px-3 py-1 text-sm rounded border"
          :class="[
          range.enabled ? 'hover:bg-blue-100' : 'opacity-50 cursor-not-allowed',
          activeRange === range.value ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'
        ]"
      >
        {{ range.label }}
      </button>
    </div>

    <div class="h-[300px] relative">
      <Chart
          type="bar"
          :data="filteredChartData"
          :options="chartOptions"
          class="w-full h-full"
      />
    </div>
  </section>
</template>
