import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchMyProperties,
    fetchPropertyById,
    addProperty,
    fetchPendingProperties
} from '@/services/propertyService.js'

export const useLandlordPropertyStore = defineStore('landlordPropertyStore', () => {
    const properties = ref([])
    const pendingProperties = ref([])
    const selectedProperty = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const loadProperties = async () => {
        loading.value = true
        error.value = null
        try {
            properties.value = await fetchMyProperties()
        } catch (err) {
            error.value = err.message || 'Failed to load properties'
        } finally {
            loading.value = false
        }
    }

    const loadPendingProperties = async () => {
        loading.value = true
        error.value = null
        try {
            pendingProperties.value = await fetchPendingProperties()
        } catch (err) {
            error.value = err.message || 'Failed to load pending properties'
        } finally {
            loading.value = false
        }
    }

    const loadPropertyById = async (id) => {
        loading.value = true
        error.value = null
        try {
            selectedProperty.value = await fetchPropertyById(id)
        } catch (err) {
            error.value = err.message || 'Failed to fetch property'
        } finally {
            loading.value = false
        }
    }

    const createProperty = async (propertyDTO, attachments) => {
        loading.value = true
        error.value = null
        try {
            const newProp = await addProperty(propertyDTO, attachments)
            properties.value.unshift(newProp)
            return newProp
        } catch (err) {
            error.value = err.message || 'Failed to create property'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        properties,
        pendingProperties,
        selectedProperty,
        loading,
        error,
        loadProperties,
        loadPendingProperties,
        loadPropertyById,
        createProperty
    }
})
