import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchPendingLeaseTerminations,
    fetchPendingLeases,
    approveLeaseTermination,
    // rejectLeaseTermination,
    approveLease,
    rejectLease,
    fetchLeaseTrends
} from '@/services/leaseService'
import { fetchPendingProperties, validateProperty } from '@/services/propertyService'
import {BASE_URL} from "@/configs/config.js";

export const useAdminDashboardStore = defineStore('adminDashboardStore', () => {
    const showTerminateModal = ref(false)
    const showPendingLeasesModal = ref(false)
    const showPendingPropertiesModal = ref(false)
    const pendingLeaseTerminations = ref([])
    const pendingLeaseApprovals = ref([])
    const pendingProperties = ref([])
    const loading = ref(false)
    const chartLoading = ref(false)

    const recentActivities = ref([])
    const landlordRatings = ref([])
    const kpiMetrics = ref({})

    // Computed stats that include pending counts
    const stats = computed(() => ({
        activeLeases: kpiMetrics.value['Total Leases'] || 0,
        pendingApprovals: pendingLeaseTerminations.value.length + pendingLeaseApprovals.value.length + pendingProperties.value.length,
        monthlyRevenue: kpiMetrics.value['Total Payments'] || '$0',
        totalUsers: kpiMetrics.value['Total Users'] || 0,
        // Additional breakdown for specific counts
        pendingTerminations: pendingLeaseTerminations.value.length,
        pendingLeases: pendingLeaseApprovals.value.length,
        pendingPropertiesCount: pendingProperties.value.length
    }))

    const leaseChartData = ref({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: []
    })

    // Helper function to find the earliest available data period
    const findEarliestDataPeriod = (leases, periodType) => {
        if (!leases.length) return null

        // Find the earliest date from all lease dates
        const allDates = []
        leases.forEach(lease => {
            if (lease.startDate) allDates.push(new Date(lease.startDate))
            if (lease.terminationRequestedAt) allDates.push(new Date(lease.terminationRequestedAt))
        })

        if (!allDates.length) return null

        const earliestDate = new Date(Math.min(...allDates))

        switch (periodType) {
            case 'monthly':
                return {
                    key: earliestDate.toISOString().slice(0, 7), // YYYY-MM format
                    label: earliestDate.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
                    start: new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1),
                    end: new Date(earliestDate.getFullYear(), earliestDate.getMonth() + 1, 0)
                }

            case 'quarterly':
                const quarter = Math.floor(earliestDate.getMonth() / 3)
                const year = earliestDate.getFullYear()
                const startMonth = quarter * 3
                return {
                    key: `${year}-Q${quarter + 1}`,
                    label: `Q${quarter + 1} ${year}`,
                    start: new Date(year, startMonth, 1),
                    end: new Date(year, startMonth + 3, 0)
                }

            case 'yearly':
                const dataYear = earliestDate.getFullYear()
                return {
                    key: dataYear.toString(),
                    label: dataYear.toString(),
                    start: new Date(dataYear, 0, 1),
                    end: new Date(dataYear, 11, 31)
                }
        }

        return null
    }

    // Helper function to check if date falls within period
    const isDateInPeriod = (dateString, period) => {
        if (!dateString) return false
        const date = new Date(dateString)
        return date >= period.start && date <= period.end
    }

    const fetchLeaseChartData = async (periodType = 'monthly') => {
        chartLoading.value = true

        try {
            const leases = await fetchLeaseTrends()

            // Find the first period with available data
            const firstPeriod = findEarliestDataPeriod(leases, periodType)

            if (!firstPeriod) {
                // No data available, show empty chart
                leaseChartData.value = {
                    labels: ['No Data'],
                    datasets: [
                        {
                            label: 'New Leases',
                            backgroundColor: '#4F46E5',
                            borderColor: '#4F46E5',
                            borderWidth: 2,
                            borderRadius: 4,
                            borderSkipped: false,
                            data: [0]
                        },
                        {
                            label: 'Terminated Leases',
                            backgroundColor: '#F87171',
                            borderColor: '#F87171',
                            borderWidth: 2,
                            borderRadius: 4,
                            borderSkipped: false,
                            data: [0]
                        }
                    ]
                }
                return
            }

            // Count lease starts and terminations for the first period only
            let leaseStartCount = 0
            let leaseEndCount = 0

            leases.forEach(lease => {
                // Count lease starts in the first period
                if (isDateInPeriod(lease.startDate, firstPeriod)) {
                    leaseStartCount++
                }

                // Count lease terminations in the first period
                // Check multiple possible termination date fields and status
                const isTerminated = lease.status === 'TERMINATED' ||
                    lease.terminationStatus === 'APPROVED' ||
                    lease.terminationRequestedAt

                if (isTerminated) {
                    // Use terminationRequestedAt if available, otherwise use createdAt for terminated leases
                    const terminationDate = lease.terminationRequestedAt ||
                        (lease.status === 'TERMINATED' ? lease.createdAt : null)

                    if (isDateInPeriod(terminationDate, firstPeriod)) {
                        leaseEndCount++
                    }
                }
            })

            // Update chart data with single period
            leaseChartData.value = {
                labels: [firstPeriod.label],
                datasets: [
                    {
                        label: 'New Leases',
                        backgroundColor: '#4F46E5',
                        borderColor: '#4F46E5',
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false,
                        data: [leaseStartCount]
                    },
                    {
                        label: 'Terminated Leases',
                        backgroundColor: '#F87171',
                        borderColor: '#F87171',
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false,
                        data: [leaseEndCount]
                    }
                ]
            }
        } catch (err) {
            console.error('Failed to fetch lease trends:', err)

            // Fallback to empty chart data
            leaseChartData.value = {
                labels: ['Error Loading Data'],
                datasets: [
                    {
                        label: 'New Leases',
                        backgroundColor: '#4F46E5',
                        borderColor: '#4F46E5',
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false,
                        data: [0]
                    },
                    {
                        label: 'Terminated Leases',
                        backgroundColor: '#F87171',
                        borderColor: '#F87171',
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false,
                        data: [0]
                    }
                ]
            }
        } finally {
            chartLoading.value = false
        }
    }

    const leaseChartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: function(context) {
                        return context[0].label
                    },
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y} leases`
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: '500'
                    },
                    color: '#6B7280'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    lineWidth: 1
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: '500'
                    },
                    color: '#6B7280',
                    callback: function(value) {
                        return Number.isInteger(value) ? value : ''
                    }
                }
            }
        },
        elements: {
            bar: {
                borderRadius: 4
            }
        }
    })

    const initDashboard = async () => {
        loading.value = true
        try {
            await Promise.all([
                fetchLeaseTerminations(),
                fetchLeaseApprovals(),
                fetchProperties(),
                fetchLeaseChartData('monthly'), // Default to monthly
                fetchMockAnalytics(),
                fetchMockRatings(),
                fetchMockActivity()
            ])
        } catch (e) {
            console.error('Failed to initialize dashboard:', e)
        } finally {
            loading.value = false
        }
    }

    const fetchLeaseTerminations = async () => {
        pendingLeaseTerminations.value = await fetchPendingLeaseTerminations()
    }

    const fetchLeaseApprovals = async () => {
        pendingLeaseApprovals.value = await fetchPendingLeases()
    }

    const fetchProperties = async () => {
        pendingProperties.value = await fetchPendingProperties()
    }

    const fetchMockAnalytics = () => {
        kpiMetrics.value = {
            'Total Users': 250,
            'Active Landlords': 45,
            'Active Tenants': 93,
            'Total Properties': 162,
            'Rented Properties': 115,
            'Total Leases': 128,
            'Avg. Monthly Rent': `$1200`,
            'Total Payments': `$93600`,
            'Pending Maintenance': 8,
            'Avg. Maintenance Response': `2.5 days`
        }
    }

    const fetchMockRatings = () => {
        landlordRatings.value = [
            { name: 'John Smith', rating: 4.5 },
            { name: 'Emily Davis', rating: 4.8 },
            { name: 'Michael Lee', rating: 4.1 }
        ]
    }

    const fetchMockActivity = () => {
        recentActivities.value = [
            { action: 'New lease created', user: 'landlord_john', date: '2024-05-07' },
            { action: 'Maintenance request resolved', user: 'landlord_emily', date: '2024-05-06' },
            { action: 'New tenant registered', user: 'tenant_lisa', date: '2024-05-05' }
        ]
    }

    const landlordRatingsDetailed = ref([])

    const fetchLandlordRatings = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/landlord-score`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            landlordRatingsDetailed.value = await res.json()
        } catch (err) {
            console.error('Failed to fetch landlord ratings', err)
        }
    }

    const openTerminationModal = async () => {
        showTerminateModal.value = true
        await fetchLeaseTerminations()
    }

    const openPendingLeasesModal = async () => {
        showPendingLeasesModal.value = true
        await fetchLeaseApprovals()
    }

    const openPendingPropertiesModal = async () => {
        showPendingPropertiesModal.value = true
        await fetchProperties()
    }

    const approveTermination = async (id) => {
        await approveLeaseTermination(id)
        pendingLeaseTerminations.value = pendingLeaseTerminations.value.filter(l => l.leaseId !== id)
    }

    const rejectTermination = async (id) => {
        await rejectLeaseTermination(id)
        pendingLeaseTerminations.value = pendingLeaseTerminations.value.filter(l => l.leaseId !== id)
    }

    const approveLeaseRequest = async (id) => {
        await approveLease(id)
        pendingLeaseApprovals.value = pendingLeaseApprovals.value.filter(l => l.leaseId !== id)
    }

    const rejectLeaseRequest = async (id) => {
        await rejectLease(id)
        pendingLeaseApprovals.value = pendingLeaseApprovals.value.filter(l => l.leaseId !== id)
    }

    // Property validation functions
    const approveProperty = async (propertyId) => {
        try {
            await validateProperty(propertyId, 'APPROVED')
            // Remove the property from pending list after successful approval
            pendingProperties.value = pendingProperties.value.filter(p => p.propertyId !== propertyId)
            return { success: true, message: 'Property approved successfully' }
        } catch (error) {
            console.error('Failed to approve property:', error)
            return { success: false, message: error.message || 'Failed to approve property' }
        }
    }

    const rejectProperty = async (propertyId) => {
        try {
            await validateProperty(propertyId, 'REJECTED')
            // Remove the property from pending list after successful rejection
            pendingProperties.value = pendingProperties.value.filter(p => p.propertyId !== propertyId)
            return { success: true, message: 'Property rejected successfully' }
        } catch (error) {
            console.error('Failed to reject property:', error)
            return { success: false, message: error.message || 'Failed to reject property' }
        }
    }

    return {
        showTerminateModal,
        showPendingLeasesModal,
        showPendingPropertiesModal,
        pendingLeaseTerminations,
        pendingLeaseApprovals,
        pendingProperties,
        recentActivities,
        landlordRatings,
        kpiMetrics,
        stats,
        leaseChartData,
        leaseChartOptions,
        loading,
        chartLoading,
        initDashboard,
        fetchLandlordRatings,
        fetchLeaseChartData,
        openTerminationModal,
        openPendingLeasesModal,
        openPendingPropertiesModal,
        approveTermination,
        rejectTermination,
        approveLease: approveLeaseRequest,
        rejectLease: rejectLeaseRequest,
        approveProperty,
        rejectProperty
    }
})