// stores/adminPropertyStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchAllPropertiesAdmin,
    validateProperty,
    fetchPendingProperties
} from '@/services/propertyService.js'

export const useAdminPropertyStore = defineStore('adminPropertyStore', () => {
    const properties = ref([])
    const selectedProperties = ref(new Set())
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const selectedStatus = ref('ALL')

    const statuses = ['ALL', 'ACTIVE', 'PENDING', 'INACTIVE', 'RENTED', 'MAINTENANCE']

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

    const filteredProperties = computed(() => {
        return properties.value.filter(property => {
            const matchesSearch = !searchQuery.value ||
                property.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                property.address?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                property.propertyId?.toString().includes(searchQuery.value)

            const matchesStatus = selectedStatus.value === 'ALL' || property.status === selectedStatus.value

            return matchesSearch && matchesStatus
        })
    })

    const averageRent = computed(() => {
        if (properties.value.length === 0) return 0
        const totalRent = properties.value.reduce((sum, property) => {
            return sum + (parseFloat(property.rentAmount) || 0)
        }, 0)
        return Math.round(totalRent / properties.value.length)
    })

    const totalPortfolioValue = computed(() => {
        return properties.value.reduce((sum, property) => {
            const annualRent = (parseFloat(property.rentAmount) || 0) * 12
            return sum + (annualRent * 20)
        }, 0)
    })

    const occupancyRate = computed(() => {
        if (totalProperties.value === 0) return 0
        return Math.round((rentedProperties.value / totalProperties.value) * 100)
    })

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

    const rejectProperty = async (propertyId) => {
        try {
            await validateProperty(propertyId, 'REJECTED')
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

    const getPropertyById = (propertyId) => {
        return properties.value.find(p => p.propertyId === parseInt(propertyId))
    }

    const getPropertiesByStatus = (status) => {
        return properties.value.filter(p => p.status === status)
    }

    const updatePropertyStatus = (propertyId, status, validationStatus = null) => {
        const propertyIndex = properties.value.findIndex(p => p.propertyId === propertyId)
        if (propertyIndex !== -1) {
            properties.value[propertyIndex].status = status
            if (validationStatus) {
                properties.value[propertyIndex].validationStatus = validationStatus
            }
        }
    }

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

    const clearFilters = () => {
        searchQuery.value = ''
        selectedStatus.value = 'ALL'
    }

    const refresh = async () => {
        await loadProperties()
    }

    return {
        properties,
        selectedProperties,
        loading,
        error,
        searchQuery,
        selectedStatus,
        statuses,

        totalProperties,
        activeProperties,
        pendingProperties,
        rentedProperties,
        inactiveProperties,
        maintenanceProperties,
        averageRent,
        totalPortfolioValue,
        occupancyRate,

        filteredProperties,

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