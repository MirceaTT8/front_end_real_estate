<script setup>
import { onMounted } from 'vue'
import { useLandlordDashboardStore } from "@/stores/dashboardStore.js";
import MonthlySummary from '@/components/landlord/dashboard/MonthlySummary.vue'
import RecentActivity from '@/components/landlord/dashboard/RecentActivity.vue'
import UpcomingDeadlines from '@/components/landlord/dashboard/UpcomingDeadlines.vue'
import FinancialOverview from '@/components/landlord/dashboard/FinancialOverview.vue'
import ActivityModal from '@/components/landlord/dashboard/ActivityModal.vue'
import CalendarModal from '@/components/landlord/dashboard/CalendarModal.vue'

const store = useLandlordDashboardStore()

onMounted(() => {
  store.initDashboard()
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
        :rent-payments-last-month="store.rentPaymentsLastMonth"
        :occupancy-rate="store.occupancyRate"
        :vacant-units="store.vacantUnits"
        :maintenance-cost-this-month="store.maintenanceCostThisMonth"
    />

    <RecentActivity
        v-if="store.activities && store.activities.length"
        :activities="store.activities"
        @view-all="store.showActivityModal = true"
    />


    <UpcomingDeadlines
        :calendar-events="store.calendarEvents"
        @view-calendar="store.showCalendar = true"
    />

    <FinancialOverview
        :range-options="store.rangeOptions"
        :active-range="store.activeRange"
        :filtered-chart-data="store.filteredChartData"
        :chart-options="store.chartOptions"
        @change-range="store.activeRange = $event"
    />

    <ActivityModal
        v-if="store.showActivityModal"
        :activities="store.activities"
        @close="store.showActivityModal = false"
    />

    <CalendarModal
        v-if="store.showCalendar"
        :calendar-events="store.calendarEvents"
        @close="store.showCalendar = false"
    />
  </div>
</template>
