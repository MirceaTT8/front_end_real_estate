import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMaintenanceRequestsByLease, addMaintenanceRequest } from '@/services/maintenanceService'
import { useTenantLeaseStore} from "@/stores/leaseTenantStore.js";

export const useMaintenanceTenantStore = defineStore('maintenanceTenantStore', () => {
    const requests = ref([])
    const loading = ref(false)
    const error = ref(null)

    const tenantLeaseStore = useTenantLeaseStore()

    const fetchRequests = async () => {
        loading.value = true
        error.value = null
        try {
            if (!tenantLeaseStore.lease) {
                await tenantLeaseStore.loadTenantLeaseData()
            }
            const leaseId = tenantLeaseStore.lease?.leaseId
            if (!leaseId) throw new Error('No active lease found')
            requests.value = await fetchMaintenanceRequestsByLease(leaseId)
        } catch (err) {
            error.value = err.message || 'Failed to load maintenance requests'
        } finally {
            loading.value = false
        }
    }

    const createRequest = async (newRequest) => {
        loading.value = true
        error.value = null
        try {
            const leaseId = tenantLeaseStore.lease?.leaseId
            if (!leaseId) throw new Error('No active lease found')

            const requestDTO = {
                description: newRequest.description,
                attachments: newRequest.attachments,
            }

            const created = await addMaintenanceRequest(leaseId, requestDTO)
            requests.value.unshift(created)
        } catch (err) {
            error.value = err.message || 'Failed to submit maintenance request'
        } finally {
            loading.value = false
        }
    }

    return {
        requests,
        loading,
        error,
        fetchRequests,
        createRequest,
    }
})
