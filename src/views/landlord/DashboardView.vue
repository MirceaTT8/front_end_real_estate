<script setup>
import {ref, onMounted, computed} from 'vue'
import Chart from 'primevue/chart'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import { fetchMyProperties } from '@/services/propertyService.js'
import { fetchPaymentsForOwner } from '@/services/paymentService.js'
import { fetchMaintenanceRequestsByLoggedInOwner } from '@/services/maintenanceService.js'
import { fetchMyLeases } from '@/services/leaseService.js'
import { fetchRecentLogs } from '@/services/logsService.js'
import { formatActivityLogs } from '@/utils/formatActivityLog.js'
import MonthlySummary from "@/components/landlord/dashboard/MonthlySummary.vue";
import RecentActivity from "@/components/landlord/dashboard/RecentActivity.vue";
import UpcomingDeadlines from "@/components/landlord/dashboard/UpcomingDeadlines.vue";
import FinancialOverview from "@/components/landlord/dashboard/FinancialOverview.vue";
import ActivityModal from "@/components/landlord/dashboard/ActivityModal.vue";
import CalendarModal from "@/components/landlord/dashboard/CalendarModal.vue";

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
const activeRange = ref('3M')

const rangeOptions = ref([
  { label: '1M', value: '1M', enabled: false },
  { label: '3M', value: '3M', enabled: false },
  { label: '6M', value: '6M', enabled: false },
  { label: '1Y', value: '1Y', enabled: false },
  { label: '5Y', value: '5Y', enabled: false }
])

const filteredChartData = computed(() => {
  if (!chartData.value || !chartData.value.datasets) {
    return {
      labels: [],
      datasets: [
        { label: 'Rent Collection', data: [], backgroundColor: '#4CAF50' },
        { label: 'Maintenance Costs', data: [], backgroundColor: '#FF9800' }
      ]
    }
  }

  const rangeMap = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, '5Y': 60 }
  const count = rangeMap[activeRange.value]
  const labels = chartData.value.labels.slice(-count)
  const rent = chartData.value.datasets[0].data.slice(-count)
  const maintenance = chartData.value.datasets[1].data.slice(-count)

  return {
    labels,
    datasets: [
      { ...chartData.value.datasets[0], data: rent },
      { ...chartData.value.datasets[1], data: maintenance }
    ]
  }
})


const updateRangeAvailability = () => {
  const monthsWithData = chartData.value?.labels?.length || 0
  rangeOptions.value.forEach(r => {
    const limit = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, '5Y': 60 }[r.value]
    r.enabled = monthsWithData >= limit
  })

  const valid = rangeOptions.value.filter(r => r.enabled)
  if (!valid.some(v => v.value === activeRange.value)) {
    activeRange.value = valid.at(-1)?.value || '1M'
  }
}


const initChart = async () => {
  const payments = await fetchPaymentsForOwner()
  const maintenance = await fetchMaintenanceRequestsByLoggedInOwner()

  const rentTotals = {}
  const maintenanceTotals = {}

  const now = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    const key = date.toISOString().slice(0, 7)
    months.push(key)
    rentTotals[key] = 0
    maintenanceTotals[key] = 0
  }

  payments.forEach(p => {
    const month = p.paymentDate?.slice(0, 7)
    if (month && rentTotals[month] !== undefined) {
      rentTotals[month] += p.amount
    }
  })

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
  updateRangeAvailability()

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
    <header class="col-span-full flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
      <div class="text-sm text-gray-500">
        Last updated: {{ new Date().toLocaleDateString() }}
      </div>
    </header>

    <MonthlySummary
        :rent-payments-last-month="rentPaymentsLastMonth"
        :occupancy-rate="occupancyRate"
        :vacant-units="vacantUnits"
        :maintenance-cost-this-month="maintenanceCostThisMonth"
    />

    <RecentActivity
        :activities="activities"
        @view-all="showActivityModal = true"
    />

    <UpcomingDeadlines
        :calendar-events="calendarEvents"
        @view-calendar="showCalendar = true"
    />

    <FinancialOverview
        :range-options="rangeOptions"
        :active-range="activeRange"
        :filtered-chart-data="filteredChartData"
        :chart-options="chartOptions"
        @change-range="activeRange = $event"
    />
    <ActivityModal
        v-if="showActivityModal"
        :activities="activities"
        @close="showActivityModal = false"
    />

    <CalendarModal
        v-if="showCalendar"
        :calendar-events="calendarEvents"
        @close="showCalendar = false"
    />

  </div>
</template>



