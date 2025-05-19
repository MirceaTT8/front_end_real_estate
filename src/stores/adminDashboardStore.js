import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchPendingLeaseTerminations,
    fetchPendingLeases,
    approveLeaseTermination,
    // rejectLeaseTermination,
    approveLease,
    rejectLease
} from '@/services/leaseService'
import { fetchPendingProperties } from '@/services/propertyService'

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
        datasets: [
            {
                label: 'New Leases',
                backgroundColor: '#4F46E5',
                data: [12, 19, 9, 14, 16]
            },
            {
                label: 'Terminated Leases',
                backgroundColor: '#F87171',
                data: [3, 5, 2, 4, 1]
            }
        ]
    })

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
        openTerminationModal,
        openPendingLeasesModal,
        openPendingPropertiesModal,
        approveTermination,
        rejectTermination,
        approveLease: approveLeaseRequest,
        rejectLease: rejectLeaseRequest
    }
})
