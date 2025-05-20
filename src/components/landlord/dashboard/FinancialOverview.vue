<script setup>
import Chart from 'primevue/chart'
import { ref } from 'vue'

const props = defineProps({
  rangeOptions: Array,
  activeRange: String,
  filteredChartData: Object,
  chartOptions: Object
})

// Track current selected tab
const activeTab = ref('income'); // income or expenses

// Calculate totals from chart data
const calculateTotals = () => {
  if (!props.filteredChartData || !props.filteredChartData.datasets || props.filteredChartData.datasets.length === 0) {
    return { income: 0, expenses: 0, net: 0 };
  }

  const incomeData = props.filteredChartData.datasets.find(d => d.label === 'Income')?.data || [];
  const expensesData = props.filteredChartData.datasets.find(d => d.label === 'Expenses')?.data || [];

  const income = incomeData.reduce((sum, val) => sum + val, 0);
  const expenses = expensesData.reduce((sum, val) => sum + val, 0);

  return {
    income,
    expenses,
    net: income - expenses
  };
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
</script>

<template>
  <section class="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Section Header -->
    <div class="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div class="flex items-center mb-4 sm:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">Financial Overview</h2>
      </div>

      <!-- Time Range Selector -->
      <div class="inline-flex p-1 bg-gray-100 rounded-lg space-x-1">
        <button
            v-for="range in rangeOptions"
            :key="range.value"
            :disabled="!range.enabled"
            @click="$emit('change-range', range.value)"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
            activeRange === range.value
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
            !range.enabled && 'opacity-50 cursor-not-allowed'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Financial Data and Chart -->
    <div class="p-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <!-- Income Card -->
        <div class="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Income</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ formatCurrency(calculateTotals().income) }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Expenses Card -->
        <div class="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Expenses</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ formatCurrency(calculateTotals().expenses) }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Net Profit Card -->
        <div class="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Net Profit</p>
              <p class="text-xl font-bold text-gray-900 mt-1"
                 :class="calculateTotals().net >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(calculateTotals().net) }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Chart Tabs -->
      <div class="mb-4 border-b border-gray-200">
        <div class="flex -mb-px">
          <button
              @click="activeTab = 'income'"
              class="py-2 px-4 border-b-2 font-medium text-sm"
              :class="activeTab === 'income' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Income
          </button>
          <button
              @click="activeTab = 'expenses'"
              class="ml-8 py-2 px-4 border-b-2 font-medium text-sm"
              :class="activeTab === 'expenses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Expenses
          </button>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white rounded-lg border border-gray-100 p-4">
        <div class="h-[350px] relative">
          <Chart
              type="bar"
              :data="filteredChartData"
              :options="chartOptions"
              class="w-full h-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>