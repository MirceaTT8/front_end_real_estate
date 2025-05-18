import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMyLease } from '@/services/leaseService'
import { fetchPropertyById } from '@/services/propertyService'
import { getPaymentsByLeaseId } from '@/services/paymentService'

export const useTenantLeaseStore = defineStore('tenantLease', () => {
    const lease = ref(null)
    const property = ref(null)
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)

    const loadTenantLeaseData = async () => {
        loading.value = true
        error.value = null
        try {
            lease.value = await fetchMyLease()
            if (lease.value?.propertyId) {
                property.value = await fetchPropertyById(lease.value.propertyId)
                payments.value = await getPaymentsByLeaseId(lease.value.leaseId)
            }
        } catch (e) {
            error.value = e.message || 'Failed to load tenant lease data.'
        } finally {
            loading.value = false
        }
    }

    return {
        lease,
        property,
        payments,
        loading,
        error,
        loadTenantLeaseData
    }
})
