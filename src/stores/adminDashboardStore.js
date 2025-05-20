import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchPendingLeaseTerminations,
    fetchPendingLeases,
    approveLeaseTermination,
    // rejectLeaseTermination,
    approveLease,
    rejectLease,
    fetchLeaseTrends
} from '@/services/leaseService'
import { fetchPendingProperties } from '@/services/propertyService'
import {BASE_URL} from "@/configs/config.js";

export const useAdminDashboardStore = defineStore('adminDashboardStore', () => {
    const showTerminateModal = ref(false)
    const showPendingLeasesModal = ref(false)
    const showPendingPropertiesModal = ref(false)
    const pendingLeaseTerminations = ref([])
    const pendingLeaseApprovals = ref([])
    const pendingProperties = ref([])
    const loading = ref(false)

    const recentActivities = ref([])
    const landlordRatings = ref([])
    const kpiMetrics = ref({})

    const leaseChartData = ref({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    })

    const fetchLeaseChartData = async () => {
        try {
            const leases = await fetchLeaseTrends()

            const now = new Date()
            const months = []
            const leaseStartCounts = {}
            const leaseEndCounts = {}

            for (let i = 5; i >= 0; i--) {
                const d = new Date(now)
                d.setMonth(d.getMonth() - i)
                const key = d.toISOString().slice(0, 7)
                months.push(key)
                leaseStartCounts[key] = 0
                leaseEndCounts[key] = 0
            }

            leases.forEach(l => {
                const start = l.startDate?.slice(0, 7)
                const end = l.terminationRequestedAt?.slice(0, 7)

                if (leaseStartCounts[start] !== undefined) leaseStartCounts[start]++
                if (leaseEndCounts[end] !== undefined) leaseEndCounts[end]++
            })

            leaseChartData.value = {
                labels: months.map(m => new Date(m + '-01').toLocaleString(undefined, { month: 'short' })),
                datasets: [
                    {
                        label: 'New Leases',
                        backgroundColor: '#4F46E5',
                        data: months.map(m => leaseStartCounts[m])
                    },
                    {
                        label: 'Terminated Leases',
                        backgroundColor: '#F87171',
                        data: months.map(m => leaseEndCounts[m])
                    }
                ]
            }
        } catch (err) {
            console.error('Failed to fetch lease trends:', err)
        }
    }


    const leaseChartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
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
                fetchLeaseChartData(),
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
        leaseChartData,
        leaseChartOptions,
        loading,
        initDashboard,
        fetchLandlordRatings,
        openTerminationModal,
        openPendingLeasesModal,
        openPendingPropertiesModal,
        approveTermination,
        rejectTermination,
        approveLease: approveLeaseRequest,
        rejectLease: rejectLeaseRequest
    }
})
