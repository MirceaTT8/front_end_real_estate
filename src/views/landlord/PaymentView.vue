
<script setup>
import { ref, onMounted, computed } from 'vue'
import PaymentLeaseFilter from "@/components/landlord/payment/PaymentLeaseFilter.vue";
import PaymentSummaryCard from "@/components/landlord/payment/PaymentSummaryCard.vue";
import PaymentTable from "@/components/landlord/payment/PaymentTable.vue";
import PaymentManualModal from "@/components/landlord/payment/PaymentManualModal.vue";

import { getPaymentsByOwnerId, createPayment } from "@/services/paymentService.js";
import { fetchPropertyById } from "@/services/propertyService.js";
import { fetchUserById } from "@/services/userService.js";
import { fetchActiveLeasesByOwnerId } from "@/services/leaseService.js";

import { watch } from 'vue'




const payments = ref([])
const leases = ref([])
const properties = ref([])
const tenants = ref([])
const selectedLease = ref(null)
const showManualPaymentModal = ref(false)
const error = ref(null)
const propertyCache = ref({})
const tenantCache = ref({})
const newPayment = ref({
  leaseId: null,
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'BANK_TRANSFER'
})

const fetchPayments = async () => {
  error.value = null
  try {
    const ownerId = 1
    const [paymentsData, leasesData] = await Promise.all([
      getPaymentsByOwnerId(ownerId),
      fetchActiveLeasesByOwnerId(ownerId)
    ])
    payments.value = paymentsData
    leases.value = leasesData

    console.log(payments.value)
    console.log(leases.value)

    const uniquePropertyIds = [...new Set(leases.value.map(l => l.propertyId))]
    const uniqueTenantIds = [...new Set(leases.value.map(l => l.tenantId))]

    await Promise.all([
      ...uniquePropertyIds.map(id =>
          fetchPropertyById(id).then(property => {
            propertyCache.value[id] = property
          })
      ),
      ...uniqueTenantIds.map(id =>
          fetchUserById(id).then(tenant => {
            tenantCache.value[id] = tenant
          })
      )
    ])
  } catch (err) {
    error.value = err.message || 'Failed to fetch payments'
    console.error('Error fetching payments:', err)
  }
}

const filteredPayments = computed(() => {
  return selectedLease.value
      ? payments.value.filter(p => p.leaseId === selectedLease.value)
      : payments.value
})

const summary = computed(() => {
  const completedPayments = payments.value.filter(p => p.status === 'COMPLETED')
  const activeLeases = leases.value.filter(l => l.status === 'ACTIVE')
  const overduePayments = payments.value.filter(
      p => p.status === 'PENDING' && new Date(p.paymentDate) < new Date()
  )

  return {
    totalCollected: completedPayments.reduce((sum, p) => sum + p.amount, 0),
    expectedMonthly: activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0),
    overdueCount: overduePayments.length
  }
})

const getTenantName = (tenantId) => {
  if (!tenantId) return 'Unknown'
  const tenant = tenantCache.value[tenantId] || tenants.value.find(t => t.userId === tenantId)
  return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
}

const getPropertyName = (propertyId) => {
  if (!propertyId) return 'Unknown'
  const property = propertyCache.value[propertyId] || properties.value.find(p => p.propertyId === propertyId)
  return property ? property.name : 'Unknown'
}

const getLeaseForPayment = (payment) => {
  return leases.value.find(l => l.leaseId === payment.leaseId)
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString()
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const recordManualPayment = async () => {
  try {
    const paymentData = {
      amount: newPayment.value.amount,
      paymentDate: newPayment.value.paymentDate,
      paymentMethod: newPayment.value.paymentMethod,
      status: 'PENDING'
    }
    const createdPayment = await createPayment(newPayment.value.leaseId, paymentData)
    payments.value.push({ ...createdPayment })
    showManualPaymentModal.value = false
    resetNewPayment()
  } catch (err) {
    error.value = err.message || 'Failed to record payment'
    console.error('Error recording payment:', err)
  }
}

const resetNewPayment = () => {
  newPayment.value = {
    leaseId: null,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER'
  }
}

const sendReminders = () => {
  alert(`Reminders sent for ${summary.value.overdueCount} overdue payments!`)
}

watch(summary, (newSummary) => {
  console.log('Summary updated:')
  console.log('Total Collected:', newSummary.totalCollected)
  console.log('Expected Monthly:', newSummary.expectedMonthly)
  console.log('Overdue Count:', newSummary.overdueCount)
})

onMounted(() => {
  fetchPayments()
})

</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Payment Management</h1>

    <PaymentLeaseFilter
        v-model:selectedLease="selectedLease"
        :leases="leases"
        :getPropertyName="getPropertyName"
        :getTenantName="getTenantName"
    />


    <PaymentSummaryCard
        :totalCollected="summary.totalCollected"
        :expectedMonthly="summary.expectedMonthly"
        :overdueCount="summary.overdueCount"
        :formatCurrency="formatCurrency"
    />


    <div class="flex flex-wrap gap-4 mb-8">
      <button
          @click="sendReminders"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md shadow-sm disabled:bg-amber-200 disabled:cursor-not-allowed transition-colors"
          :disabled="summary.overdueCount === 0"
      >
        Send Reminders ({{ summary.overdueCount }})
      </button>
      <button
          @click="showManualPaymentModal = true"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
      >
        Record Manual Payment
      </button>
    </div>

    <PaymentTable
        :filteredPayments="filteredPayments"
        :getLeaseForPayment="getLeaseForPayment"
        :getPropertyName="getPropertyName"
        :getTenantName="getTenantName"
        :formatCurrency="formatCurrency"
        :formatDate="formatDate"
    />

    <PaymentManualModal
        v-if="showManualPaymentModal"
        :leases="leases"
        :newPayment="newPayment"
        :getPropertyName="getPropertyName"
        :getTenantName="getTenantName"
        @submit="recordManualPayment"
        @cancel="showManualPaymentModal = false"
    />
  </div>
</template>
