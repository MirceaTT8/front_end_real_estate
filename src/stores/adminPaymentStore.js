import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllPayments } from '@/services/paymentService'

export const usePaymentAdminStore = defineStore('paymentAdmin', () => {
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)

    const filters = ref({
        status: 'ALL',
        query: ''
    })

    const fetchPayments = async () => {
        loading.value = true
        error.value = null
        try {
            payments.value = await getAllPayments()
        } catch (err) {
            error.value = 'Failed to fetch payments'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const filteredPayments = computed(() => {
        return payments.value.filter(p => {
            const matchesStatus = filters.value.status === 'ALL' || p.status === filters.value.status
            const matchesQuery = filters.value.query === '' ||
                p.paymentId.toString().includes(filters.value.query) ||
                p.leaseId.toString().includes(filters.value.query)

            return matchesStatus && matchesQuery
        })
    })

    return {
        payments,
        loading,
        error,
        filters,
        filteredPayments,
        fetchPayments
    }
})
