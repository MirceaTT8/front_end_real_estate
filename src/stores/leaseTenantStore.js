// Updated leaseTenantStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchMyLease,
    fetchActiveTenantLease,
    checkTenantHasLease
} from '@/services/leaseService'
import { fetchPropertyById } from '@/services/propertyService'
import { getPaymentsByLeaseId } from '@/services/paymentService'

export const useTenantLeaseStore = defineStore('tenantLease', () => {
    const lease = ref(null)
    const property = ref(null)
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const hasLease = ref(null) // null = unknown, true = has lease, false = no lease

    // Computed property to check if tenant has any lease record
    const tenantHasAnyLease = computed(() => hasLease.value)

    // Computed property to check if tenant has active lease
    const tenantHasActiveLease = computed(() => lease.value !== null)

    const loadTenantLeaseData = async () => {
        loading.value = true
        error.value = null

        try {
            // First check if tenant exists in the system with any lease
            const leaseExists = await checkTenantHasLease()
            hasLease.value = leaseExists

            if (!leaseExists) {
                // Tenant has never had a lease
                lease.value = null
                property.value = null
                payments.value = []
                return
            }

            // Try to get active lease
            const activeLeaseData = await fetchActiveTenantLease()

            if (!activeLeaseData) {
                // Tenant had lease before but no active lease now
                lease.value = null
                property.value = null
                payments.value = []
                return
            }

            lease.value = activeLeaseData

            // Load related data if lease exists
            if (lease.value?.propertyId) {
                property.value = await fetchPropertyById(lease.value.propertyId)
            }

            if (lease.value?.leaseId) {
                payments.value = await getPaymentsByLeaseId(lease.value.leaseId)
            }

        } catch (e) {
            console.error('Error loading tenant lease data:', e)
            error.value = e.message || 'Failed to load tenant lease data.'

            // Set defaults on error
            lease.value = null
            property.value = null
            payments.value = []
            hasLease.value = false
        } finally {
            loading.value = false
        }
    }

    // Function to retry loading lease data
    const retryLoadLease = async () => {
        await loadTenantLeaseData()
    }

    // Function to clear lease data (for logout, etc.)
    const clearLeaseData = () => {
        lease.value = null
        property.value = null
        payments.value = []
        hasLease.value = null
        error.value = null
    }

    return {
        lease,
        property,
        payments,
        loading,
        error,
        hasLease,
        tenantHasAnyLease,
        tenantHasActiveLease,
        loadTenantLeaseData,
        retryLoadLease,
        clearLeaseData
    }
})