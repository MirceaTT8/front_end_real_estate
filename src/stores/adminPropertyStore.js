// stores/adminPropertyStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchAllPropertiesAdmin,
    validateProperty,
    fetchPendingProperties
} from '@/services/propertyService'

export const useAdminPropertyStore = defineStore('adminPropertyStore', () => {
    const properties = ref([])
    const selectedProperties = ref(new Set())
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const selectedStatus = ref('ALL')

    // Available statuses for filtering
    const statuses = ['ALL', 'ACTIVE', 'PENDING', 'INACTIVE', 'RENTED', 'MAINTENANCE']

    // Computed properties for dashboard metrics
    const totalProperties = computed(() => properties.value.length)

    const activeProperties = computed(() =>
        properties.value.filter(p => p.status === 'ACTIVE').length
    )

    const pendingProperties = computed(() =>
        properties.value.filter(p => p.validationStatus === 'PENDING').length
    )

    const rentedProperties = computed(() =>
        properties.value.filter(p => p.status === 'RENTED').length
    )

    const inactiveProperties = computed(() =>
        properties.value.filter(p => p.status === 'INACTIVE').length
    )

    const maintenanceProperties = computed(() =>
        properties.value.filter(p => p.status === 'MAINTENANCE').length
    )

    // Computed property for filtered properties
    const filteredProperties = computed(() => {
        return properties.value.filter(property => {
            // Filter by search query
            const matchesSearch = !searchQuery.value ||
                property.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                property.address?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                property.propertyId?.toString().includes(searchQuery.value)

            // Filter by status
            const matchesStatus = selectedStatus.value === 'ALL' || property.status === selectedStatus.value

            return matchesSearch && matchesStatus
        })
    })

    // Average rent calculation
    const averageRent = computed(() => {
        if (properties.value.length === 0) return 0
        const totalRent = properties.value.reduce((sum, property) => {
            return sum + (parseFloat(property.rentAmount) || 0)
        }, 0)
        return Math.round(totalRent / properties.value.length)
    })

    // Total portfolio value (estimated)
    const totalPortfolioValue = computed(() => {
        return properties.value.reduce((sum, property) => {
            // Estimate property value as 20x annual rent (rough calculation)
            const annualRent = (parseFloat(property.rentAmount) || 0) * 12
            return sum + (annualRent * 20)
        }, 0)
    })

    // Occupancy rate
    const occupancyRate = computed(() => {
        if (totalProperties.value === 0) return 0
        return Math.round((rentedProperties.value / totalProperties.value) * 100)
    })

    // Load all properties
    const loadProperties = async () => {
        loading.value = true
        error.value = null
        try {
            properties.value = await fetchAllPropertiesAdmin()
        } catch (err) {
            error.value = err.message || 'Failed to load properties'
            console.error('Error loading properties:', err)
        } finally {
            loading.value = false
        }
    }

    // Approve a property
    const approveProperty = async (propertyId) => {
        try {
            await validateProperty(propertyId, 'APPROVED')
            // Update the property in the local state
            const propertyIndex = properties.value.findIndex(p => p.propertyId === propertyId)
            if (propertyIndex !== -1) {
                properties.value[propertyIndex].validationStatus = 'APPROVED'
                properties.value[propertyIndex].status = 'ACTIVE'
            }
            return { success: true, message: 'Property approved successfully' }
        } catch (err) {
            error.value = err.message || 'Failed to approve property'
            return { success: false, message: err.message || 'Failed to approve property' }
        }
    }

    // Reject a property
    const rejectProperty = async (propertyId) => {
        try {
            await validateProperty(propertyId, 'REJECTED')
            // Update the property in the local state
            const propertyIndex = properties.value.findIndex(p => p.propertyId === propertyId)
            if (propertyIndex !== -1) {
                properties.value[propertyIndex].validationStatus = 'REJECTED'
                properties.value[propertyIndex].status = 'INACTIVE'
            }
            return { success: true, message: 'Property rejected successfully' }
        } catch (err) {
            error.value = err.message || 'Failed to reject property'
            return { success: false, message: err.message || 'Failed to reject property' }
        }
    }

    // Get property by ID
    const getPropertyById = (propertyId) => {
        return properties.value.find(p => p.propertyId === parseInt(propertyId))
    }

    // Filter properties by status
    const getPropertiesByStatus = (status) => {
        return properties.value.filter(p => p.status === status)
    }

    // Update property status locally (for real-time updates)
    const updatePropertyStatus = (propertyId, status, validationStatus = null) => {
        const propertyIndex = properties.value.findIndex(p => p.propertyId === propertyId)
        if (propertyIndex !== -1) {
            properties.value[propertyIndex].status = status
            if (validationStatus) {
                properties.value[propertyIndex].validationStatus = validationStatus
            }
        }
    }

    // Bulk operations
    const bulkApproveProperties = async () => {
        try {
            const promises = [...selectedProperties.value].map(propertyId =>
                approveProperty(propertyId)
            )
            await Promise.all(promises)
            selectedProperties.value.clear()
            return { success: true, message: 'Properties approved successfully' }
        } catch (err) {
            error.value = err.message || 'Failed to approve selected properties'
            return { success: false, message: err.message || 'Failed to approve selected properties' }
        }
    }

    const bulkRejectProperties = async () => {
        try {
            const promises = [...selectedProperties.value].map(propertyId =>
                rejectProperty(propertyId)
            )
            await Promise.all(promises)
            selectedProperties.value.clear()
            return { success: true, message: 'Properties rejected successfully' }
        } catch (err) {
            error.value = err.message || 'Failed to reject selected properties'
            return { success: false, message: err.message || 'Failed to reject selected properties' }
        }
    }

    // Clear filters
    const clearFilters = () => {
        searchQuery.value = ''
        selectedStatus.value = 'ALL'
    }

    // Refresh data
    const refresh = async () => {
        await loadProperties()
    }

    return {
        // State
        properties,
        selectedProperties,
        loading,
        error,
        searchQuery,
        selectedStatus,
        statuses,

        // Computed properties - metrics
        totalProperties,
        activeProperties,
        pendingProperties,
        rentedProperties,
        inactiveProperties,
        maintenanceProperties,
        averageRent,
        totalPortfolioValue,
        occupancyRate,

        // Computed properties - filtered data
        filteredProperties,

        // Actions
        loadProperties,
        approveProperty,
        rejectProperty,
        getPropertyById,
        getPropertiesByStatus,
        updatePropertyStatus,
        bulkApproveProperties,
        bulkRejectProperties,
        clearFilters,
        refresh
    }
})