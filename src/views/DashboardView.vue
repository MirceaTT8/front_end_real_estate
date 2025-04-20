<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

const activities = ref([
  { type: 'payment', description: 'Jane Smith paid rent for Downtown Loft', time: '2 hours ago' },
  { type: 'maintenance-tenant', description: 'New maintenance-tenant request for Sunset Apartments', time: '1 day ago' },
  { type: 'lease', description: 'Mike Johnson signed lease renewal', time: '3 days ago' },
  { type: 'message', description: 'New message from Sarah Williams', time: '5 days ago' }
])

const quickActions = [
  { icon: '📝', label: 'Create Lease', action: () => navigateTo('/leases/new') },
  { icon: '💰', label: 'Record Payment', action: () => navigateTo('/payments/new') },
  { icon: '🔧', label: 'Manage Requests', action: () => navigateTo('/maintenance-tenant') },
  { icon: '✉️', label: 'Send Notice', action: () => navigateTo('/messages/new') }
]

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
    maintainAspectRatio: false
  }
}

const deadlines = ref([
  { type: 'lease', description: 'Lease renewal for Apt 3B', date: '2024-06-15' },
  { type: 'inspection', description: 'Annual property inspection', date: '2024-06-20' },
  { type: 'tax', description: 'Property tax due', date: '2024-06-30' }
])

const navigateTo = (path) => {
  console.log('Navigating to:', path)
}

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
    <h1 class="col-span-full text-2xl font-bold text-gray-800 mb-4">Landlord Dashboard</h1>

    <!-- Quick Actions -->
    <section class="col-span-full bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
            v-for="(action, index) in quickActions"
            :key="index"
            @click="action.action"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md"
        >
          <span class="text-3xl mb-2">{{ action.icon }}</span>
          <span class="font-medium">{{ action.label }}</span>
        </button>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="col-span-full md:col-span-6 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200">Recent Activity</h2>
      <div class="space-y-4">
        <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50"
        >
          <div class="text-2xl">
            <span v-if="activity.type === 'payment'">💰</span>
            <span v-else-if="activity.type === 'maintenance-tenant'">🔧</span>
            <span v-else-if="activity.type === 'lease'">📝</span>
            <span v-else>✉️</span>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ activity.description }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts and Graphs -->
    <section class="col-span-full md:col-span-6 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200">Financial Overview</h2>
      <div class="h-[300px] relative">
        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="w-full h-full"
        />
      </div>
    </section>

    <section class="col-span-full bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200">Upcoming Deadlines</h2>
      <div class="space-y-4">
        <div
            v-for="(deadline, index) in deadlines"
            :key="index"
            class="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
        >
          <div class="text-2xl">
            <span v-if="deadline.type === 'lease'">📝</span>
            <span v-else-if="deadline.type === 'inspection'">🔍</span>
            <span v-else>💰</span>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ deadline.description }}</p>
            <p class="text-sm text-gray-600 mt-1">
              Due in {{ daysUntil(deadline.date) }} days ({{ new Date(deadline.date).toLocaleDateString() }})
            </p>
          </div>
          <button class="px-4 py-2 bg-blue-50 text-blue-500 font-medium rounded hover:bg-blue-100">
            Set Reminder
          </button>
        </div>
      </div>
    </section>
  </div>
</template>