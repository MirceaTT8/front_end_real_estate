import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatActivityLogs } from '@/utils/formatActivityLog.js'
import { fetchRecentLogs } from '@/services/logsService.js'
import { fetchMyProperties } from '@/services/propertyService.js'
import { usePaymentLandlordStore } from './paymentStore.js'
import { useMaintenanceLandlordStore } from './maintenanceStore.js'
import { useLeaseStore } from './leaseStore.js'

export const useLandlordDashboardStore = defineStore('landlordDashboardStore', () => {
    const showActivityModal = ref(false)
    const showCalendar = ref(false)
    const activities = ref([])
    const calendarEvents = ref([])

    const occupancyRate = ref(0)
    const vacantUnits = ref(0)
    const rentPaymentsLastMonth = ref(0)
    const maintenanceCostThisMonth = ref(0)

    const activeRange = ref('1M')
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

    const getMonthsWithData = (payments, maintenance) => {
        const monthsSet = new Set()

        payments.forEach(payment => {
            if (payment.paymentDate) {
                const month = payment.paymentDate.slice(0, 7)
                monthsSet.add(month)
            }
        })

        maintenance.forEach(request => {
            if (request.status === 'COMPLETED' && request.updatedAt) {
                const month = request.updatedAt.slice(0, 7)
                monthsSet.add(month)
            }
        })

        return Array.from(monthsSet).sort()
    }

    const generateConsecutiveMonths = (firstDataMonth) => {
        const months = []
        const start = new Date(firstDataMonth + '-01')
        const now = new Date()

        const current = new Date(start)
        while (current <= now) {
            months.push(current.toISOString().slice(0, 7))
            current.setMonth(current.getMonth() + 1)
        }

        return months
    }

    const updateRangeAvailability = (payments, maintenance) => {
        const monthsWithData = getMonthsWithData(payments, maintenance)

        if (monthsWithData.length === 0) {
            rangeOptions.value.forEach(r => r.enabled = false)
            return
        }

        const consecutiveMonths = generateConsecutiveMonths(monthsWithData[0])
        const totalMonths = consecutiveMonths.length

        rangeOptions.value.forEach(range => {
            const limit = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, '5Y': 60 }[range.value]
            range.enabled = totalMonths >= limit
        })

        const enabledRanges = rangeOptions.value.filter(r => r.enabled)
        if (enabledRanges.length > 0 && !rangeOptions.value.find(r => r.value === activeRange.value)?.enabled) {
            activeRange.value = enabledRanges[0].value
        }
    }

    const isInLast30Days = dateStr => {
        if (!dateStr) return false;

        const inputDate = new Date(dateStr);
        const now = new Date();

        const diffInMs = now.getTime() - inputDate.getTime();

        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        return diffInDays >= 0 && diffInDays <= 30;
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

        // Get months with actual data
        const monthsWithData = getMonthsWithData(payments, maintenance)

        let months = []
        let rentTotals = {}
        let maintenanceTotals = {}

        if (monthsWithData.length > 0) {
            months = generateConsecutiveMonths(monthsWithData[0])

            months.forEach(month => {
                rentTotals[month] = 0
                maintenanceTotals[month] = 0
            })

            payments.forEach(p => {
                const month = p.paymentDate?.slice(0, 7)
                if (rentTotals[month] !== undefined) {
                    rentTotals[month] += p.amount
                }
            })

            maintenance.forEach(r => {
                const month = r.updatedAt?.slice(0, 7)
                if (r.status === 'COMPLETED' && maintenanceTotals[month] !== undefined) {
                    maintenanceTotals[month] += r.cost || 0
                }
            })
        }

        chartData.value = {
            labels: months.map(m => new Date(m + '-01').toLocaleString(undefined, { month: 'short', year: 'numeric' })),
            datasets: [
                { label: 'Rent Collection', data: months.map(m => rentTotals[m] || 0), backgroundColor: '#4CAF50' },
                { label: 'Maintenance Costs', data: months.map(m => maintenanceTotals[m] || 0), backgroundColor: '#FF9800' }
            ]
        }

        chartOptions.value = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString()
                        }
                    }
                }
            }
        }

        updateRangeAvailability(payments, maintenance)

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

        const now = new Date()
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

        try {
            const logs = await fetchRecentLogs()
            activities.value = formatActivityLogs(logs)
        } catch (error) {
            console.warn('Could not load recent activities:', error)
            activities.value = []
        }
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