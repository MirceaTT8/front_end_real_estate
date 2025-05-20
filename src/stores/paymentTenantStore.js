import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchPaymentsForLease, createPayment, createStripeCheckoutSession } from '@/services/paymentService'
import { useTenantLeaseStore } from "@/stores/leaseTenantStore.js";

export const usePaymentTenantStore = defineStore('paymentTenantStore', () => {
    const payments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const yearlyPayments = ref([]) // To store YTD payments specifically

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

            payments.value = await fetchPaymentsForLease(leaseId)

            updateYearlyPayments()
        } catch (err) {
            error.value = err.message || 'Failed to load payments'
        } finally {
            loading.value = false
        }
    }

    const updateYearlyPayments = () => {
        const currentYear = new Date().getFullYear()
        yearlyPayments.value = payments.value.filter(payment => {
            const paymentDate = new Date(payment.paymentDate)
            return paymentDate.getFullYear() === currentYear && payment.status === 'COMPLETED'
        })
    }

    const makePayment = async (paymentData) => {
        loading.value = true
        error.value = null
        try {
            const leaseId = tenantLeaseStore.lease?.leaseId
            if (!leaseId) throw new Error('No active lease found')
            const newPayment = await createPayment(leaseId, paymentData)
            if (newPayment) {
                payments.value.unshift(newPayment)
                updateYearlyPayments() // Update yearly payments after adding a new payment
            }
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

    // Total paid Year-to-Date
    const totalPaidYTD = computed(() => {
        return yearlyPayments.value.reduce((sum, payment) => sum + payment.amount, 0)
    })

    // Payment history by month for the current year
    const paymentsByMonth = computed(() => {
        const months = Array(12).fill(0)

        yearlyPayments.value.forEach(payment => {
            const paymentDate = new Date(payment.paymentDate)
            months[paymentDate.getMonth()] += payment.amount
        })

        return months
    })

    const startStripeCheckout = async () => {
        const leaseId = tenantLeaseStore.lease?.leaseId
        if (!leaseId) throw new Error('No active lease found')
        return await createStripeCheckoutSession(leaseId)
    }

    // Next payment date calculation (matching LeaseTenantView logic)
    const nextPaymentDate = computed(() => {
        const lease = tenantLeaseStore.lease
        if (!lease) return new Date()

        const startDate = new Date(lease.startDate)
        const today = new Date()

        // Calculate the day of month that rent is due (same day as lease start)
        const dueDayOfMonth = startDate.getDate()

        let nextDate = new Date(today.getFullYear(), today.getMonth(), dueDayOfMonth)

        // If today is past the due date for this month, next payment is next month
        if (today.getDate() > dueDayOfMonth) {
            nextDate.setMonth(nextDate.getMonth() + 1)
        }

        return nextDate
    })

    // Days until next payment
    const daysUntilNextPayment = computed(() => {
        const today = new Date()
        const diffTime = Math.abs(nextPaymentDate.value - today)
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    })

    return {
        payments,
        yearlyPayments,
        loading,
        error,
        fetchPayments,
        makePayment,
        hasPaidThisCycle,
        currentBalance,
        totalPaidYTD,
        paymentsByMonth,
        nextPaymentDate,
        daysUntilNextPayment,
        startStripeCheckout,
    }
})