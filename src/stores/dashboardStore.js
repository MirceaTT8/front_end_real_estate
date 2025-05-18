import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatActivityLogs } from '@/utils/formatActivityLog'
import { fetchRecentLogs } from '@/services/logsService'
import { fetchMyProperties } from '@/services/propertyService'
import { usePaymentLandlordStore } from './paymentStore'
import { useMaintenanceLandlordStore } from './maintenanceStore'
import { useLeaseStore } from './leaseStore'

export const useLandlordDashboardStore = defineStore('landlordDashboardStore', () => {
    const showActivityModal = ref(false)
    const showCalendar = ref(false)
    const activities = ref([])
    const calendarEvents = ref([])

    const occupancyRate = ref(0)
    const vacantUnits = ref(0)
    const rentPaymentsLastMonth = ref(0)
    const maintenanceCostThisMonth = ref(0)

    const activeRange = ref('3M')
    const chartData = ref()
    const chartOptions = ref()
    const rangeOptions = ref([
        { label: '1M', value: '1M', enabled: false },
        { label: '3M', value: '3M', enabled: false },
        { label: '6M', value: '6M', enabled: false },
        { label: '1Y', value: '1Y', enabled: false },
        { label: '5Y', value: '5Y', enabled: false }
    ])

    const filteredChartData = computed(() => {
        if (!chartData.value?.datasets) {
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
        return {
            labels: chartData.value.labels.slice(-count),
            datasets: chartData.value.datasets.map(ds => ({
                ...ds,
                data: ds.data.slice(-count)
            }))
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

    const isInLast30Days = dateStr => {
        const date = new Date(dateStr)
        const now = new Date()
        const past = new Date()
        past.setDate(now.getDate() - 30)
        return date >= past && date <= now
    }

    const initDashboard = async () => {
        const paymentStore = usePaymentLandlordStore()
        const maintenanceStore = useMaintenanceLandlordStore()
        const leaseStore = useLeaseStore()

        await Promise.all([
            paymentStore.loadPayments(),
            maintenanceStore.loadRequests(),
            leaseStore.loadLeases()
        ])

        const payments = paymentStore.payments
        const maintenance = maintenanceStore.requests
        const leases = leaseStore.leases
        const properties = await fetchMyProperties()

        // Financial chart data
        const rentTotals = {}, maintenanceTotals = {}, months = []
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now)
            d.setMonth(d.getMonth() - i)
            const key = d.toISOString().slice(0, 7)
            months.push(key)
            rentTotals[key] = 0
            maintenanceTotals[key] = 0
        }

        payments.forEach(p => {
            const month = p.paymentDate?.slice(0, 7)
            if (rentTotals[month] !== undefined) rentTotals[month] += p.amount
        })

        maintenance.forEach(r => {
            const month = r.updatedAt?.slice(0, 7)
            if (r.status === 'COMPLETED' && maintenanceTotals[month] !== undefined) {
                maintenanceTotals[month] += r.cost || 0
            }
        })

        chartData.value = {
            labels: months.map(m => new Date(m + '-01').toLocaleString(undefined, { month: 'short' })),
            datasets: [
                { label: 'Rent Collection', data: months.map(m => rentTotals[m]), backgroundColor: '#4CAF50' },
                { label: 'Maintenance Costs', data: months.map(m => maintenanceTotals[m]), backgroundColor: '#FF9800' }
            ]
        }
        chartOptions.value = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
        updateRangeAvailability()

        // Metrics
        const total = properties.length
        const vacant = properties.filter(p => p.status === 'AVAILABLE').length
        const occupied = total - vacant

        occupancyRate.value = total ? Math.round((occupied / total) * 100) : 0
        vacantUnits.value = vacant

        rentPaymentsLastMonth.value = payments
            .filter(p => isInLast30Days(p.paymentDate))
            .reduce((sum, p) => sum + p.amount, 0)

        maintenanceCostThisMonth.value = maintenance
            .filter(r => isInLast30Days(r.updatedAt) && r.status === 'COMPLETED')
            .reduce((sum, r) => sum + (r.cost || 0), 0)

        // Events
        const events = []

        payments.forEach(p => {
            const date = new Date(p.paymentDate)
            if (p.status !== 'PAID') {
                events.push({
                    start: date,
                    end: date,
                    title: `Rent Payment: $${p.amount.toFixed(2)}`,
                    content: 'Payment',
                    class: 'payment-event'
                })
            }
        })

        maintenance.forEach(r => {
            if (['OPEN', 'PENDING'].includes(r.status)) {
                const date = new Date(r.createdAt)
                events.push({
                    start: date,
                    end: date,
                    title: `Maintenance: ${r.description}`,
                    content: 'Maintenance',
                    class: 'maintenance-event'
                })
            }
        })

        leases.forEach(l => {
            if (l.endDate) {
                const end = new Date(l.endDate)
                const soon = new Date()
                soon.setDate(now.getDate() + 60)
                if (end >= now && end <= soon) {
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

        const logs = await fetchRecentLogs()
        activities.value = formatActivityLogs(logs)
    }

    return {
        showActivityModal,
        showCalendar,
        activities,
        calendarEvents,
        chartData,
        chartOptions,
        activeRange,
        rangeOptions,
        filteredChartData,
        occupancyRate,
        vacantUnits,
        rentPaymentsLastMonth,
        maintenanceCostThisMonth,
        initDashboard
    }
})
