<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import { fetchMyProperties } from '@/services/propertyService.js'
import { fetchPaymentsForOwner } from '@/services/paymentService.js'
import { fetchMaintenanceRequestsByLoggedInOwner } from '@/services/maintenanceService.js'
import { fetchMyLeases } from '@/services/leaseService.js'
import { fetchRecentLogs } from '@/services/logsService.js'
import { formatActivityLogs } from '@/utils/formatActivityLog.js'

const showActivityModal = ref(false)
const showCalendar = ref(false)
const activities = ref([])
const chartData = ref()
const chartOptions = ref()
const occupancyRate = ref(0)
const vacantUnits = ref(0)
const rentPaymentsLastMonth = ref(0)
const maintenanceCostThisMonth = ref(0)
const calendarEvents = ref([])

function isInLast30Days(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(now.getDate() - 30)
  return date >= thirtyDaysAgo && date <= now
}

const initChart = async () => {
  const payments = await fetchPaymentsForOwner()
  const maintenance = await fetchMaintenanceRequestsByLoggedInOwner()

  const rentTotals = {}
  const maintenanceTotals = {}

  const months = [...Array(6)].map((_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    return date.toISOString().slice(0, 7) // "YYYY-MM"
  })

  // Initialize with 0
  months.forEach(m => {
    rentTotals[m] = 0
    maintenanceTotals[m] = 0
  })

  // Rent payments
  payments.forEach(p => {
    const month = p.paymentDate?.slice(0, 7)
    if (month && rentTotals[month] !== undefined) {
      rentTotals[month] += p.amount
    }
  })

  // Maintenance costs
  maintenance.forEach(r => {
    if (r.status === 'COMPLETED' && r.updatedAt && r.cost) {
      const month = r.updatedAt.slice(0, 7)
      if (month && maintenanceTotals[month] !== undefined) {
        maintenanceTotals[month] += r.cost
      }
    }
  })

  chartData.value = {
    labels: months.map(m => {
      const [year, month] = m.split('-')
      return new Date(year, month - 1).toLocaleString(undefined, { month: 'short' })
    }),
    datasets: [
      {
        label: 'Rent Collection',
        data: months.map(m => rentTotals[m]),
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Maintenance Costs',
        data: months.map(m => maintenanceTotals[m]),
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


onMounted(async () => {
  await initChart()

  try {
    const now = new Date()
    const soon = new Date()
    soon.setDate(now.getDate() + 14)
    const leaseThreshold = new Date()
    leaseThreshold.setDate(now.getDate() + 60)

    const properties = await fetchMyProperties()
    const total = properties.length
    const vacant = properties.filter(p => p.status === 'AVAILABLE').length
    const occupied = total - vacant

    occupancyRate.value = total > 0 ? Math.round((occupied / total) * 100) : 0
    vacantUnits.value = vacant

    const logs = await fetchRecentLogs()
    activities.value = formatActivityLogs(logs)

    const payments = await fetchPaymentsForOwner()
    rentPaymentsLastMonth.value = payments
        .filter(p => isInLast30Days(p.paymentDate))
        .reduce((sum, p) => sum + p.amount, 0)

    const events = []

    payments.forEach(p => {
      const date = new Date(p.paymentDate)
      if (p.status !== 'PAID' && date <= soon) {
        events.push({
          start: date,
          end: date,
          title: `Rent Payment: $${p.amount.toFixed(2)}`,
          content: 'Payment',
          class: 'payment-event'
        })
      }
    })

    const maintenance = await fetchMaintenanceRequestsByLoggedInOwner()

    // 🛠️ Maintenance cost calculation
    maintenanceCostThisMonth.value = maintenance
        .filter(r => r.status === 'COMPLETED' && isInLast30Days(r.updatedAt))
        .reduce((sum, r) => sum + (r.cost || 0), 0)

    maintenance.forEach(r => {
      if (['OPEN', 'PENDING'].includes(r.status)) {
        const date = new Date(r.createdAt)
        events.push({
          start: date,
          end: date,
          title: `Maintenance: ${r.description || 'No description'}`,
          content: 'Maintenance',
          class: 'maintenance-event'
        })
      }
    })

    const leases = await fetchMyLeases()
    leases.forEach(l => {
      if (l.endDate) {
        const end = new Date(l.endDate)
        if (end >= now && end <= leaseThreshold) {
          events.push({
            start: end,
            end: end,
            title: `Lease ending (Property #${l.propertyId})`,
            content: 'Lease',
            class: 'lease-event'
          })
        }
      }
    })

    calendarEvents.value = events
  } catch (err) {
    console.error('Error loading dashboard data:', err)
  }
})
</script>
<template>
  <div class="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
    <!-- Header -->
    <header class="col-span-full flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
      <div class="text-sm text-gray-500">
        Last updated: {{ new Date().toLocaleDateString() }}
      </div>
    </header>

    <!-- Monthly Summary -->
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

    <!-- Recent Activity -->
    <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Recent Activity</h2>
        <button v-if="activities.length > 5" @click="showActivityModal = true"
                class="text-sm text-blue-600 hover:underline">
          View All
        </button>
      </div>
      <div class="space-y-4">
        <div
            v-for="(activity, index) in activities.slice(0, 5)"
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

    <!-- Upcoming Deadlines -->
    <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Upcoming Deadlines</h2>
        <button class="text-sm text-blue-600 hover:underline" @click="showCalendar = true">
          View Calendar
        </button>
      </div>
      <div class="space-y-3">
        <div
            v-for="(event, index) in calendarEvents.slice(0, 5)"
            :key="index"
            class="p-3 border-l-4 bg-blue-50 rounded-r-lg"
            :class="{
            'border-blue-500': event.class === 'payment-event',
            'border-green-500': event.class === 'lease-event',
            'border-red-500': event.class === 'maintenance-event'
          }"
        >
          <p class="font-medium">{{ event.title }}</p>
          <p class="text-sm text-gray-600">{{ new Date(event.start).toLocaleDateString() }}</p>
        </div>
      </div>
    </section>

    <!-- Financial Chart -->
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

  <!-- Activity Modal -->
  <div v-if="showActivityModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
      <button @click="showActivityModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">✕</button>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">All Activity</h2>
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
    </div>
  </div>

  <!-- Vue Cal Calendar Modal -->
  <div v-if="showCalendar" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
      <button @click="showCalendar = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">✕</button>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Calendar</h2>
      <VueCal
          :events="calendarEvents"
          :time="false"
          default-view="month"
          style="height: 600px"
      />
    </div>
  </div>
</template>



