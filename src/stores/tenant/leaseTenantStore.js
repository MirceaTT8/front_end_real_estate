// Updated leaseTenantStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchMyLease,
    fetchActiveTenantLease,
    checkTenantHasLease
} from '@/services/leaseService.js'
import { fetchPropertyById } from '@/services/propertyService.js'
import { getPaymentsByLeaseId } from '@/services/paymentService.js'

export const useTenantLeaseStore = defineStore('tenantLease', () => {
    const lease = ref(null)
    const property = ref(null)
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const hasLease = ref(null)
    const tenantHasAnyLease = computed(() => hasLease.value)

    const tenantHasActiveLease = computed(() => lease.value !== null)

    const loadTenantLeaseData = async () => {
        loading.value = true
        error.value = null

        try {
            const leaseExists = await checkTenantHasLease()
            hasLease.value = leaseExists

            if (!leaseExists) {
                lease.value = null
                property.value = null
                payments.value = []
                return
            }

            const activeLeaseData = await fetchActiveTenantLease()

            if (!activeLeaseData) {
                lease.value = null
                property.value = null
                payments.value = []
                return
            }

            lease.value = activeLeaseData

            if (lease.value?.propertyId) {
                property.value = await fetchPropertyById(lease.value.propertyId)
            }

            if (lease.value?.leaseId) {
                payments.value = await getPaymentsByLeaseId(lease.value.leaseId)
            }

        } catch (e) {
            console.error('Error loading tenant lease data:', e)
            error.value = e.message || 'Failed to load tenant lease data.'

            lease.value = null
            property.value = null
            payments.value = []
            hasLease.value = false
        } finally {
            loading.value = false
        }
    }

    const retryLoadLease = async () => {
        await loadTenantLeaseData()
    }

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