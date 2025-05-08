<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { fetchMyProperties } from '@/services/propertyService.js'
import { fetchPaymentsForOwner } from '@/services/paymentService.js'
import {fetchMaintenanceRequestsByLoggedInOwner} from "@/services/maintenanceService.js";
import {fetchMyLeases} from "@/services/leaseService.js";
import { fetchRecentLogs } from "@/services/logsService.js";

const activities = ref([])
const chartData = ref()
const chartOptions = ref()
const occupancyRate = ref(0)
const vacantUnits = ref(0)
const rentPaymentsLastMonth = ref(0)

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

// const deadlines = ref([
//   { type: 'lease', description: 'Lease renewal for Apt 3B', date: '2024-06-15' },
//   { type: 'inspection', description: 'Annual property inspection', date: '2024-06-20' },
//   { type: 'tax', description: 'Property tax due', date: '2024-06-30' }
// ])

const daysUntil = (dateString) => {
  const today = new Date()
  const deadline = new Date(dateString)
  const diffTime = deadline - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const isInLast30Days = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(now.getDate() - 30)
  return date >= thirtyDaysAgo && date <= now
}

function formatTimeAgo(timestamp) {
  const time = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - time) / 1000 / 60) // minutes

  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff} min ago`
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const deadlines = ref([])

const loadUpcomingDeadlines = async () => {
  const now = new Date()
  const soon = new Date()
  soon.setDate(now.getDate() + 14)
  const leaseThreshold = new Date()
  leaseThreshold.setDate(now.getDate() + 60)

  const result = []

  try {
    // 🧾 Rent payments due soon
    const payments = await fetchPaymentsForOwner()
    payments.forEach(p => {
      const due = new Date(p.dueDate)
      if (p.status !== 'PAID' && due <= soon) {
        result.push({
          type: 'payment',
          description: `Rent due for ${p.tenantName || 'Tenant'} (${p.propertyName || 'Property'})`,
          date: due
        })
      }
    })

    // 🛠 Open maintenance requests
    const maintenance = await fetchMaintenanceRequestsByLoggedInOwner()
    maintenance.forEach(r => {
      if (['OPEN', 'PENDING'].includes(r.status)) {
        result.push({
          type: 'maintenance',
          description: `Unresolved maintenance: ${r.title || 'Unnamed'}`,
          date: null // No due date, but treat as urgent
        })
      }
    })

    // 📆 Lease expirations in 60 days
    const leases = await fetchMyLeases()
    leases.forEach(l => {
      const end = new Date(l.endDate)
      if (end >= now && end <= leaseThreshold) {
        result.push({
          type: 'lease',
          description: `Lease expiring for ${l.tenantName || 'Tenant'}`,
          date: end
        })
      }
    })

    // Sort deadlines (put nulls last)
    deadlines.value = result.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(a.date) - new Date(b.date)
    })
  } catch (err) {
    console.error('Failed to load deadlines:', err)
  }
}



onMounted(async () => {
  initChart()
  await loadUpcomingDeadlines()

  try {
    const properties = await fetchMyProperties()
    const total = properties.length
    const vacant = properties.filter(p => p.status === 'AVAILABLE').length
    const occupied = total - vacant

    occupancyRate.value = total > 0 ? Math.round((occupied / total) * 100) : 0
    vacantUnits.value = vacant

    const logs = await fetchRecentLogs()

    activities.value = logs.map(log => ({
      type: log.type || 'message',
      description: log.actionType,
      time: formatTimeAgo(log.createdAt)
    }))

    const payments = await fetchPaymentsForOwner()

    rentPaymentsLastMonth.value = payments
        .filter(p => isInLast30Days(p.paymentDate))
        .reduce((sum, p) => sum + p.amount, 0)
  } catch (err) {
    console.error('Error loading dashboard data:', err)
  }
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
          <p class="text-2xl font-bold">${{ rentPaymentsLastMonth.toLocaleString() }}</p>
          <p class="text-xs text-green-600">Past 30 days</p>
        </div>
<!--        <div class="p-4 bg-blue-50 rounded-lg">-->
<!--          <p class="text-sm text-blue-700">Maintenance Costs</p>-->
<!--          <p class="text-2xl font-bold">$2,200</p>-->
<!--          <p class="text-xs text-blue-600">-5% from last month</p>-->
<!--        </div>-->
        <div class="p-4 bg-purple-50 rounded-lg">
          <p class="text-sm text-purple-700">Occupancy Rate</p>
          <p class="text-2xl font-bold">{{ occupancyRate }}%</p>
          <p class="text-xs text-purple-600">{{ vacantUnits }} units available</p>
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
            Due in {{ deadline.date ? daysUntil(deadline.date) + ' days' : 'ASAP' }} •
            {{ deadline.date ? new Date(deadline.date).toLocaleDateString() : '' }}
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
