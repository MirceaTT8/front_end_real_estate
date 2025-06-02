import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllTenantScores } from '../../services/tenantScoreService.js'

export const useTenantRatingsStore = defineStore('tenantRatingsStore', () => {
    const tenantRatings = ref([])
    const loading = ref(false)
    const error = ref(null)

    const transformApiData = (apiData) => {
        return apiData.map(item => ({
            id: item.tenantId,
            tenantId: item.tenantId,
            name: `Tenant #${item.tenantId}`, // You might want to fetch actual names
            email: `tenant.${item.tenantId}@email.com`, // You might want to fetch actual emails
            overallScore: item.overallScore || 0,
            paymentScore: item.paymentScore || 0,
            feedbackScore: item.feedbackScore || 0,
            punctualityRatio: item.paymentPunctualityRatio || 0,
            totalPayments: item.totalPayments || 0,
            latePayments: item.latePayments || 0,
            onTimePayments: item.onTimePayments || 0,
            activeLeases: item.activeLeases || 0,
            completedLeases: item.completedLeases || 0,
            paymentHistory: item.latePayments === 0 ? 'Excellent' :
                item.paymentPunctualityRatio >= 0.9 ? 'Good' :
                    item.paymentPunctualityRatio >= 0.7 ? 'Fair' : 'Poor',
            lastUpdated: item.lastUpdated
        }))
    }

    const fetchRatings = async () => {
        loading.value = true
        error.value = null

        try {
            const apiData = await fetchAllTenantScores()
            const transformedData = transformApiData(apiData)
            tenantRatings.value = transformedData
        } catch (err) {
            error.value = err.message || 'Failed to load tenant ratings'
            console.error('Error fetching tenant ratings:', err)
        } finally {
            loading.value = false
        }
    }

    const refreshRatings = async () => {
        await fetchRatings()
    }

    const getTenantById = (tenantId) => {
        return tenantRatings.value.find(tenant => tenant.tenantId === tenantId) || null
    }

    const averageOverallScore = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        const sum = tenantRatings.value.reduce((acc, tenant) => acc + (tenant.overallScore || 0), 0)
        return sum / tenantRatings.value.length
    })

    const averagePaymentScore = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        const sum = tenantRatings.value.reduce((acc, tenant) => acc + (tenant.paymentScore || 0), 0)
        return sum / tenantRatings.value.length
    })

    const averageFeedbackScore = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        const sum = tenantRatings.value.reduce((acc, tenant) => acc + (tenant.feedbackScore || 0), 0)
        return sum / tenantRatings.value.length
    })

    const averagePunctualityRatio = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        const sum = tenantRatings.value.reduce((acc, tenant) => acc + (tenant.punctualityRatio || 0), 0)
        return sum / tenantRatings.value.length
    })

    const topRatedTenant = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 'N/A'
        const sorted = [...tenantRatings.value].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
        return sorted[0]?.name || 'N/A'
    })

    const totalTenants = computed(() => {
        return tenantRatings.value ? tenantRatings.value.length : 0
    })

    const totalLatePayments = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        return tenantRatings.value.reduce((acc, tenant) => acc + (tenant.latePayments || 0), 0)
    })

    const totalPayments = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        return tenantRatings.value.reduce((acc, tenant) => acc + (tenant.totalPayments || 0), 0)
    })

    const totalActiveLeases = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        return tenantRatings.value.reduce((acc, tenant) => acc + (tenant.activeLeases || 0), 0)
    })

    const totalCompletedLeases = computed(() => {
        if (!tenantRatings.value || !tenantRatings.value.length) return 0
        return tenantRatings.value.reduce((acc, tenant) => acc + (tenant.completedLeases || 0), 0)
    })

    // Tenants by rating category
    const excellentTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => (tenant.overallScore || 0) >= 4.5)
    })

    const goodTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => {
            const score = tenant.overallScore || 0
            return score >= 3.5 && score < 4.5
        })
    })

    const averageTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => {
            const score = tenant.overallScore || 0
            return score >= 2.5 && score < 3.5
        })
    })

    const poorTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => (tenant.overallScore || 0) < 2.5)
    })

    const reliableTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => (tenant.paymentScore || 0) >= 4.0)
    })

    const unreliableTenants = computed(() => {
        if (!tenantRatings.value) return []
        return tenantRatings.value.filter(tenant => (tenant.paymentScore || 0) < 3.0)
    })

    const getSortedTenants = (sortBy = 'overallScore', direction = 'desc') => {
        if (!tenantRatings.value) return []

        return [...tenantRatings.value].sort((a, b) => {
            const modifier = direction === 'asc' ? 1 : -1

            const aValue = a[sortBy] || 0
            const bValue = b[sortBy] || 0

            if (aValue < bValue) return -1 * modifier
            if (aValue > bValue) return 1 * modifier
            return 0
        })
    }

    return {
        tenantRatings,
        loading,
        error,

        fetchRatings,
        refreshRatings,
        getSortedTenants,
        getTenantById,

        averageOverallScore,
        averagePaymentScore,
        averageFeedbackScore,
        averagePunctualityRatio,
        topRatedTenant,
        totalTenants,
        totalLatePayments,
        totalPayments,
        totalActiveLeases,
        totalCompletedLeases,

        excellentTenants,
        goodTenants,
        averageTenants,
        poorTenants,
        reliableTenants,
        unreliableTenants
    }
})