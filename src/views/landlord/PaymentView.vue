<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPaymentsForOwner, createPayment } from '@/services/paymentService.js'
import { fetchMyLeases } from '@/services/leaseService.js'
import { fetchAllUsers } from '@/services/userService.js' // assumes you have this
import PaymentSummaryCard from '@/components/landlord/payment/PaymentSummaryCard.vue'
import PaymentTable from '@/components/landlord/payment/PaymentTable.vue'
import PaymentManualModal from '@/components/landlord/payment/PaymentManualModal.vue'
import PaymentLeaseFilter from '@/components/landlord/payment/PaymentLeaseFilter.vue'

const payments = ref([])
const leases = ref([])
const users = ref([])
const loading = ref(true)
const error = ref(null)
const showManualModal = ref(false)
const selectedLeaseId = ref(null)
const newPayment = ref({
  leaseId: null,
  amount: 0,
  paymentDate: '',
  paymentMethod: 'BANK_TRANSFER'
})

const filteredPayments = computed(() => {
  if (!selectedLeaseId.value) return payments.value
  return payments.value.filter(p => p.leaseId === selectedLeaseId.value)
})

const getPropertyName = (propertyId) => {
  const lease = leases.value.find(l => l.propertyId === propertyId)
  return lease?.property?.name || `Property ${propertyId}`
}

const getTenantName = (tenantId) => {
  const tenant = users.value.find(u => u.userId === tenantId)
  return tenant ? `${tenant.firstName} ${tenant.lastName}` : `Tenant ${tenantId}`
}

const loadPayments = async () => {
  try {
    loading.value = true
    error.value = null
    payments.value = await fetchPaymentsForOwner()
    leases.value = await fetchMyLeases()
    users.value = await fetchAllUsers() // optional, if needed for tenant names
  } catch (err) {
    error.value = err.message || 'Failed to load payments'
  } finally {
    loading.value = false
  }
}

const handleSubmitManualPayment = async (payment) => {
  try {
    loading.value = true
    await createPayment(payment.leaseId, payment)
    await loadPayments()
    showManualModal.value = false
  } catch (err) {
    error.value = err.message || 'Failed to record payment'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadPayments()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Payments</h1>
      <button
          @click="showManualModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        + Add Payment
      </button>
    </header>

    <div v-if="error" class="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-4">
      {{ error }}
    </div>

    <PaymentSummaryCard :payments="filteredPayments" />

    <PaymentLeaseFilter
        :payments="payments"
        v-model:selectedLeaseId="selectedLeaseId"
    />

    <PaymentTable :payments="filteredPayments" :loading="loading" />

    <PaymentManualModal
        v-if="showManualModal"
        :leases="leases"
        :newPayment="newPayment"
        :getPropertyName="getPropertyName"
        :getTenantName="getTenantName"
        @close="showManualModal = false"
        @cancel="showManualModal = false"
        @submit="handleSubmitManualPayment"
    />

  </div>
</template>
