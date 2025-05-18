import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPaymentsByLeaseId, createPayment, createStripeCheckoutSession } from '@/services/paymentService'
import { useTenantLeaseStore} from "@/stores/leaseTenantStore.js";

export const usePaymentTenantStore = defineStore('paymentTenantStore', () => {
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)

    const tenantLeaseStore = useTenantLeaseStore()

    const fetchPayments = async () => {
        loading.value = true
        error.value = null
        try {
            if (!tenantLeaseStore.lease) {
                await tenantLeaseStore.loadTenantLeaseData()
            }
            const leaseId = tenantLeaseStore.lease?.leaseId
            if (!leaseId) throw new Error('No active lease found')
            payments.value = await getPaymentsByLeaseId(leaseId)
        } catch (err) {
            error.value = err.message || 'Failed to load payments'
        } finally {
            loading.value = false
        }
    }

    const makePayment = async (paymentData) => {
        loading.value = true
        error.value = null
        try {
            const leaseId = tenantLeaseStore.lease?.leaseId
            if (!leaseId) throw new Error('No active lease found')
            const newPayment = await createPayment(leaseId, paymentData)
            if (newPayment) payments.value.unshift(newPayment)
        } catch (err) {
            error.value = err.message || 'Payment failed'
        } finally {
            loading.value = false
        }
    }

    const hasPaidThisCycle = computed(() => {
        const lease = tenantLeaseStore.lease
        if (!lease || !payments.value.length) return false

        const startDate = new Date(lease.startDate)
        const today = new Date()

        const monthsSinceStart = (today.getFullYear() - startDate.getFullYear()) * 12 +
            (today.getMonth() - startDate.getMonth())

        const cycleStart = new Date(startDate)
        cycleStart.setMonth(startDate.getMonth() + monthsSinceStart)

        const nextCycleStart = new Date(cycleStart)
        nextCycleStart.setMonth(cycleStart.getMonth() + 1)

        return payments.value.some(payment => {
            const paymentDate = new Date(payment.paymentDate)
            return payment.status === 'COMPLETED' && paymentDate >= cycleStart && paymentDate < nextCycleStart
        })
    })

    const currentBalance = computed(() => {
        return hasPaidThisCycle.value ? 0 : tenantLeaseStore.lease?.monthlyRent || 0
    })

    const startStripeCheckout = async () => {
        const leaseId = tenantLeaseStore.lease?.leaseId
        if (!leaseId) throw new Error('No active lease found')
        return await createStripeCheckoutSession(leaseId)
    }

    return {
        payments,
        loading,
        error,
        fetchPayments,
        makePayment,
        hasPaidThisCycle,
        currentBalance,
        startStripeCheckout,
    }
})
