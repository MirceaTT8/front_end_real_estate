import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAllLandlordScores } from '../services/landlordScoreService.js'

export const useLandlordRatingsStore = defineStore('landlordRatingsStore', () => {
    const landlordRatings = ref([])
    const loading = ref(false)
    const error = ref(null)

    /**
     * Transform API data to match the expected format
     * @param {Array} apiData - Raw data from API
     * @returns {Array} Transformed data
     */
    const transformApiData = (apiData) => {
        return apiData.map(item => ({
            id: item.landlordId,
            landlordId: item.landlordId,
            name: `Landlord #${item.landlordId}`, // You might want to fetch actual names
            email: `landlord.${item.landlordId}@email.com`, // You might want to fetch actual emails
            overallScore: item.overallScore || 0,
            communicationScore: item.behaviorScore || 0, // Map behaviorScore to communicationScore
            maintenanceScore: item.maintenanceScore || 0,
            ratingScore: item.ratingScore || 0,
            totalProperties: 0, // Not available in API data
            activeLeases: item.completedLeases || 0,
            flaggedProperties: item.flaggedProperties || 0,
            averageResponseTime: item.avgMaintenanceResponseTime || 0,
            lastUpdated: item.lastUpdated
        }))
    }

    /**
     * Fetch landlord ratings from API
     */
    const fetchRatings = async () => {
        loading.value = true
        error.value = null

        try {
            const apiData = await fetchAllLandlordScores()
            const transformedData = transformApiData(apiData)
            landlordRatings.value = transformedData
        } catch (err) {
            error.value = err.message || 'Failed to load landlord ratings'
            console.error('Error fetching landlord ratings:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Refresh ratings data
     */
    const refreshRatings = async () => {
        await fetchRatings()
    }

    /**
     * Get a specific landlord by ID
     * @param {number} landlordId
     * @returns {Object|null}
     */
    const getLandlordById = (landlordId) => {
        return landlordRatings.value.find(landlord => landlord.landlordId === landlordId) || null
    }

    // Computed statistics
    const averageOverallScore = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        const sum = landlordRatings.value.reduce((acc, landlord) => acc + (landlord.overallScore || 0), 0)
        return sum / landlordRatings.value.length
    })

    const topRatedLandlord = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 'N/A'
        const sorted = [...landlordRatings.value].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
        return sorted[0]?.name || 'N/A'
    })

    const totalLandlords = computed(() => {
        return landlordRatings.value ? landlordRatings.value.length : 0
    })

    const totalFlaggedProperties = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        return landlordRatings.value.reduce((acc, landlord) => acc + (landlord.flaggedProperties || 0), 0)
    })

    const averageResponseTime = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        const sum = landlordRatings.value.reduce((acc, landlord) => acc + (landlord.averageResponseTime || 0), 0)
        return sum / landlordRatings.value.length
    })

    const averageCommunicationScore = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        const sum = landlordRatings.value.reduce((acc, landlord) => acc + (landlord.communicationScore || 0), 0)
        return sum / landlordRatings.value.length
    })

    const averageMaintenanceScore = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        const sum = landlordRatings.value.reduce((acc, landlord) => acc + (landlord.maintenanceScore || 0), 0)
        return sum / landlordRatings.value.length
    })

    const averageRatingScore = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        const sum = landlordRatings.value.reduce((acc, landlord) => acc + (landlord.ratingScore || 0), 0)
        return sum / landlordRatings.value.length
    })

    const totalActiveLeases = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        return landlordRatings.value.reduce((acc, landlord) => acc + (landlord.activeLeases || 0), 0)
    })

    const totalProperties = computed(() => {
        if (!landlordRatings.value || !landlordRatings.value.length) return 0
        return landlordRatings.value.reduce((acc, landlord) => acc + (landlord.totalProperties || 0), 0)
    })

    // Landlords by rating category
    const excellentLandlords = computed(() => {
        if (!landlordRatings.value) return []
        return landlordRatings.value.filter(landlord => (landlord.overallScore || 0) >= 4.5)
    })

    const goodLandlords = computed(() => {
        if (!landlordRatings.value) return []
        return landlordRatings.value.filter(landlord => {
            const score = landlord.overallScore || 0
            return score >= 3.5 && score < 4.5
        })
    })

    const averageLandlords = computed(() => {
        if (!landlordRatings.value) return []
        return landlordRatings.value.filter(landlord => {
            const score = landlord.overallScore || 0
            return score >= 2.5 && score < 3.5
        })
    })

    const poorLandlords = computed(() => {
        if (!landlordRatings.value) return []
        return landlordRatings.value.filter(landlord => (landlord.overallScore || 0) < 2.5)
    })

    // Sorted landlords (for table display)
    const getSortedLandlords = (sortBy = 'overallScore', direction = 'desc') => {
        if (!landlordRatings.value) return []

        return [...landlordRatings.value].sort((a, b) => {
            const modifier = direction === 'asc' ? 1 : -1

            const aValue = a[sortBy] || 0
            const bValue = b[sortBy] || 0

            if (aValue < bValue) return -1 * modifier
            if (aValue > bValue) return 1 * modifier
            return 0
        })
    }

    return {
        // State
        landlordRatings,
        loading,
        error,

        // Actions
        fetchRatings,
        refreshRatings,
        getSortedLandlords,
        getLandlordById,

        // Computed statistics
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

        // Rating categories
        excellentLandlords,
        goodLandlords,
        averageLandlords,
        poorLandlords
    }
})