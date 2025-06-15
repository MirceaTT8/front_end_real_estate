import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useBaseAdminStore } from '@/composables/useBaseAdminStore.js'
import { fetchAllTenantScores } from '@/services/tenantScoreService.js'

export const useTenantRatingsStore = defineStore('tenantRatings', () => {
    const baseStore = useBaseAdminStore({
        entityName: 'tenant ratings',
        defaultSortField: 'overallScore',
        defaultSortDirection: 'desc',
        pageSize: 20,
        searchFields: ['name', 'tenantId'],
        idField: 'tenantId'
    })

    const transformApiData = (apiData) => {
        return apiData.map(item => ({
            tenantId: item.tenantId,
            name: item.name || `${item.firstName} ${item.lastName}`,
            overallScore: item.overallScore || 0,
            paymentScore: item.paymentScore || 0,
            feedbackScore: item.feedbackScore || 0,
            punctualityRatio: item.paymentPunctualityRatio || 0,
            latePayments: item.latePayments || 0,
            totalPayments: item.totalPayments || 0,
            activeLeases: item.activeLeases || 0,
            completedLeases: item.completedLeases || 0,
            paymentHistory: item.paymentPunctualityRatio >= 0.95 ? 'Excellent' :
                item.paymentPunctualityRatio >= 0.9 ? 'Good' :
                    item.paymentPunctualityRatio >= 0.7 ? 'Fair' : 'Poor',
            lastUpdated: item.lastUpdated
        }))
    }

    const fetchRatings = async () => {
        await baseStore.fetchItems(async () => {
            const apiData = await fetchAllTenantScores()
            return transformApiData(apiData)
        })
    }

    const refreshRatings = () => fetchRatings()

    const getTenantById = (tenantId) => {
        return baseStore.items.find(tenant => tenant.tenantId === tenantId) || null
    }

    const getSortedTenants = (sortBy = 'overallScore', direction = 'desc') => {
        return [...baseStore.items].sort((a, b) => {
            const modifier = direction === 'asc' ? 1 : -1
            const aValue = a[sortBy] || 0
            const bValue = b[sortBy] || 0

            if (aValue < bValue) return -1 * modifier
            if (aValue > bValue) return 1 * modifier
            return 0
        })
    }

    const averageOverallScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, tenant) => acc + (tenant.overallScore || 0), 0)
        return sum / baseStore.items.length
    })

    const averagePaymentScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, tenant) => acc + (tenant.paymentScore || 0), 0)
        return sum / baseStore.items.length
    })

    const averageFeedbackScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, tenant) => acc + (tenant.feedbackScore || 0), 0)
        return sum / baseStore.items.length
    })

    const averagePunctualityRatio = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, tenant) => acc + (tenant.punctualityRatio || 0), 0)
        return sum / baseStore.items.length
    })

    const topRatedTenant = computed(() => {
        if (!baseStore.items.length) return 'N/A'
        const sorted = [...baseStore.items].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
        return sorted[0]?.name || 'N/A'
    })

    const totalTenants = computed(() => baseStore.items.length)

    const totalLatePayments = computed(() => {
        return baseStore.items.reduce((acc, tenant) => acc + (tenant.latePayments || 0), 0)
    })

    const totalPayments = computed(() => {
        return baseStore.items.reduce((acc, tenant) => acc + (tenant.totalPayments || 0), 0)
    })

    const totalActiveLeases = computed(() => {
        return baseStore.items.reduce((acc, tenant) => acc + (tenant.activeLeases || 0), 0)
    })

    const totalCompletedLeases = computed(() => {
        return baseStore.items.reduce((acc, tenant) => acc + (tenant.completedLeases || 0), 0)
    })

    const excellentTenants = computed(() => {
        return baseStore.items.filter(tenant => (tenant.overallScore || 0) >= 4.5)
    })

    const goodTenants = computed(() => {
        return baseStore.items.filter(tenant => {
            const score = tenant.overallScore || 0
            return score >= 3.5 && score < 4.5
        })
    })

    const averageTenants = computed(() => {
        return baseStore.items.filter(tenant => {
            const score = tenant.overallScore || 0
            return score >= 2.5 && score < 3.5
        })
    })

    const poorTenants = computed(() => {
        return baseStore.items.filter(tenant => (tenant.overallScore || 0) < 2.5)
    })

    const reliableTenants = computed(() => {
        return baseStore.items.filter(tenant => (tenant.paymentScore || 0) >= 4.0)
    })

    const unreliableTenants = computed(() => {
        return baseStore.items.filter(tenant => (tenant.paymentScore || 0) < 3.0)
    })

    return {
        ...baseStore,
        fetchRatings,
        refreshRatings,
        getSortedTenants,
        getTenantById,
        tenantRatings: baseStore.items,
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