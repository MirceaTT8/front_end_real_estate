<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

const activities = ref([
  { type: 'payment', description: 'Jane Smith paid rent for Downtown Loft', time: '2 hours ago' },
  { type: 'maintenance', description: 'New maintenance request for Sunset Apartments', time: '1 day ago' },
  { type: 'lease', description: 'Mike Johnson signed lease renewal', time: '3 days ago' },
  { type: 'message', description: 'New message from Sarah Williams', time: '5 days ago' }
])

const chartData = ref()
const chartOptions = ref()

const initChart = () => {
  chartData.value = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rent Collection',
        data: [12000, 15000, 18000, 12000, 15000, 18000],
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Maintenance Costs',
        data: [2000, 1500, 3000, 2500, 1800, 2200],
        backgroundColor: '#FF9800'
      }
    ]
  }

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
}

const deadlines = ref([
  { type: 'lease', description: 'Lease renewal for Apt 3B', date: '2024-06-15' },
  { type: 'inspection', description: 'Annual property inspection', date: '2024-06-20' },
  { type: 'tax', description: 'Property tax due', date: '2024-06-30' }
])

const daysUntil = (dateString) => {
  const today = new Date()
  const deadline = new Date(dateString)
  const diffTime = deadline - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
    <header class="col-span-full flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
      <div class="text-sm text-gray-500">
        Last updated: {{ new Date().toLocaleDateString() }}
      </div>
    </header>

    <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Monthly Summary</h2>
      <div class="space-y-4">
        <div class="p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-green-700">Collected Rent</p>
          <p class="text-2xl font-bold">$18,000</p>
          <p class="text-xs text-green-600">+12% from last month</p>
        </div>
        <div class="p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-700">Maintenance Costs</p>
          <p class="text-2xl font-bold">$2,200</p>
          <p class="text-xs text-blue-600">-5% from last month</p>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg">
          <p class="text-sm text-purple-700">Occupancy Rate</p>
          <p class="text-2xl font-bold">92%</p>
          <p class="text-xs text-purple-600">3 units available</p>
        </div>
      </div>
    </section>

    <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Recent Activity</h2>
        <button class="text-sm text-blue-600 hover:underline">View All</button>
      </div>
      <div class="space-y-4">
        <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="mt-1 text-xl">
            <span v-if="activity.type === 'payment'">💰</span>
            <span v-else-if="activity.type === 'maintenance'">🔧</span>
            <span v-else-if="activity.type === 'lease'">📝</span>
            <span v-else>✉️</span>
          </div>
          <div>
            <p class="font-medium">{{ activity.description }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Upcoming Deadlines</h2>
        <button class="text-sm text-blue-600 hover:underline">View Calendar</button>
      </div>
      <div class="space-y-3">
        <div
            v-for="(deadline, index) in deadlines"
            :key="index"
            class="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
        >
          <p class="font-medium">{{ deadline.description }}</p>
          <p class="text-sm text-gray-600">
            Due in {{ daysUntil(deadline.date) }} days • {{ new Date(deadline.date).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </section>

    <section class="col-span-full bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h2>
      <div class="h-[300px] relative">
        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="w-full h-full"
        />
      </div>
    </section>
  </div>
</template>