// stores/tenant/leaseTenantStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    fetchMyLease,
    fetchAllTenantLeases, // New function to get all tenant leases
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

    // Only true for ACTIVE leases - keep this for backward compatibility
    const tenantHasActiveLease = computed(() =>
        lease.value !== null && lease.value.status === 'ACTIVE'
    )

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

            // Get all leases for this tenant (returns array)
            const allLeases = await fetchAllTenantLeases()

            if (!allLeases || allLeases.length === 0) {
                lease.value = null
                property.value = null
                payments.value = []
                return
            }

            // Store priority logic: PENDING > ACTIVE > most recent TERMINATED
            let currentLease = null

            // First priority: PENDING leases
            const pendingLease = allLeases.find(l => l.status === 'PENDING')
            if (pendingLease) {
                currentLease = pendingLease
            } else {
                // Second priority: ACTIVE leases
                const activeLease = allLeases.find(l => l.status === 'ACTIVE')
                if (activeLease) {
                    currentLease = activeLease
                } else {
                    // Third priority: most recent TERMINATED lease
                    const terminatedLeases = allLeases.filter(l => l.status === 'TERMINATED')
                    if (terminatedLeases.length > 0) {
                        currentLease = terminatedLeases.sort((a, b) =>
                            new Date(b.endDate) - new Date(a.endDate)
                        )[0]
                    }
                }
            }

            lease.value = currentLease

            if (lease.value?.propertyId) {
                property.value = await fetchPropertyById(lease.value.propertyId)
            }

            // Only fetch payments if lease is ACTIVE
            if (lease.value?.leaseId && lease.value.status === 'ACTIVE') {
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