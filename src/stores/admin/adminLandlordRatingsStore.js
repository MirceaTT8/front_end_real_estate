import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useBaseAdminStore } from '@/composables/useBaseAdminStore.js'
import { fetchAllLandlordScores } from '@/services/landlordScoreService.js'

export const useLandlordRatingsStore = defineStore('landlordRatingsStore', () => {
    const baseStore = useBaseAdminStore({
        entityName: 'landlord ratings',
        defaultSortField: 'overallScore',
        defaultSortDirection: 'desc',
        pageSize: 20,
        searchFields: ['name', 'landlordId'],
        idField: 'landlordId'
    })

    const transformApiData = (apiData) => {
        return apiData.map(item => ({
            id: item.landlordId,
            landlordId: item.landlordId,
            name: `Landlord #${item.landlordId}`,
            email: `landlord.${item.landlordId}@email.com`,
            overallScore: item.overallScore || 0,
            communicationScore: item.behaviorScore || 0,
            maintenanceScore: item.maintenanceScore || 0,
            ratingScore: item.ratingScore || 0,
            totalProperties: 0,
            activeLeases: item.completedLeases || 0,
            flaggedProperties: item.flaggedProperties || 0,
            averageResponseTime: item.avgMaintenanceResponseTime || 0,
            lastUpdated: item.lastUpdated
        }))
    }

    const fetchRatings = async () => {
        await baseStore.fetchItems(async () => {
            const apiData = await fetchAllLandlordScores()
            return transformApiData(apiData)
        })
    }

    const refreshRatings = () => fetchRatings()

    const getLandlordById = (landlordId) => {
        return baseStore.items.find(landlord => landlord.landlordId === landlordId) || null
    }

    const getSortedLandlords = (sortBy = 'overallScore', direction = 'desc') => {
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
        const sum = baseStore.items.reduce((acc, landlord) => acc + (landlord.overallScore || 0), 0)
        return sum / baseStore.items.length
    })

    const topRatedLandlord = computed(() => {
        if (!baseStore.items.length) return 'N/A'
        const sorted = [...baseStore.items].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
        return sorted[0]?.name || 'N/A'
    })

    const totalLandlords = computed(() => baseStore.items.length)

    const totalFlaggedProperties = computed(() => {
        return baseStore.items.reduce((acc, landlord) => acc + (landlord.flaggedProperties || 0), 0)
    })

    const averageResponseTime = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, landlord) => acc + (landlord.averageResponseTime || 0), 0)
        return sum / baseStore.items.length
    })

    const averageCommunicationScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, landlord) => acc + (landlord.communicationScore || 0), 0)
        return sum / baseStore.items.length
    })

    const averageMaintenanceScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, landlord) => acc + (landlord.maintenanceScore || 0), 0)
        return sum / baseStore.items.length
    })

    const averageRatingScore = computed(() => {
        if (!baseStore.items.length) return 0
        const sum = baseStore.items.reduce((acc, landlord) => acc + (landlord.ratingScore || 0), 0)
        return sum / baseStore.items.length
    })

    const totalActiveLeases = computed(() => {
        return baseStore.items.reduce((acc, landlord) => acc + (landlord.activeLeases || 0), 0)
    })

    const totalProperties = computed(() => {
        return baseStore.items.reduce((acc, landlord) => acc + (landlord.totalProperties || 0), 0)
    })

    const excellentLandlords = computed(() => {
        return baseStore.items.filter(landlord => (landlord.overallScore || 0) >= 4.5)
    })

    const goodLandlords = computed(() => {
        return baseStore.items.filter(landlord => {
            const score = landlord.overallScore || 0
            return score >= 3.5 && score < 4.5
        })
    })

    const averageLandlords = computed(() => {
        return baseStore.items.filter(landlord => {
            const score = landlord.overallScore || 0
            return score >= 2.5 && score < 3.5
        })
    })

    const poorLandlords = computed(() => {
        return baseStore.items.filter(landlord => (landlord.overallScore || 0) < 2.5)
    })

    return {
        ...baseStore,
        fetchRatings,
        refreshRatings,
        getSortedLandlords,
        getLandlordById,
        landlordRatings: baseStore.items,
        averageOverallScore,
        topRatedLandlord,
        totalLandlords,
        totalFlaggedProperties,
        averageResponseTime,
        averageCommunicationScore,
        averageMaintenanceScore,
        averageRatingScore,
        totalActiveLeases,
        totalProperties,
        excellentLandlords,
        goodLandlords,
        averageLandlords,
        poorLandlords
    }
})