<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPaymentsForOwner, createPayment } from '@/services/paymentService.js'
import { fetchMyLeases } from '@/services/leaseService.js'
import { fetchAllUsers, fetchUserById } from '@/services/userService.js'
import PaymentSummaryCard from '@/components/landlord/payment/PaymentSummaryCard.vue'
import PaymentTable from '@/components/landlord/payment/PaymentTable.vue'
import PaymentManualModal from '@/components/landlord/payment/PaymentManualModal.vue'
import PaymentLeaseFilter from '@/components/landlord/payment/PaymentLeaseFilter.vue'
import {fetchPropertyById} from "@/services/propertyService.js";

const payments = ref([])
const leases = ref([])
const users = ref([])
const properties = ref([])
const tenants = ref([])
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

const loadPayments = async () => {
  try {
    loading.value = true
    error.value = null
    payments.value = await fetchPaymentsForOwner()
    leases.value = await fetchMyLeases()
    users.value = await fetchAllUsers()
    properties.value = await Promise.all(leases.value.map(lease => fetchPropertyById(lease.propertyId)))
    tenants.value = await Promise.all(
        leases.value.map(async lease => {
          if (lease.tenantId) {
            try {
              return await fetchUserById(lease.tenantId)
            } catch (e) {
              console.warn(`Failed to fetch tenant ${lease.tenantId}:`, e)
              return null
            }
          } else {
            console.warn('Skipped null tenantId for lease:', lease.leaseId)
            return null
          }
        })
    )


    leases.value = leases.value.map(lease => ({
      ...lease,
      property: properties.value.find(p => p.propertyId === lease.propertyId)
    }))
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
        :leases="leases"
        v-model:selectedLeaseId="selectedLeaseId"
    />

    <PaymentTable
        :payments="filteredPayments"
        :leases="leases"
        :tenants="tenants"
        :properties="properties"
        :loading="loading"
    />


    <PaymentManualModal
        v-if="showManualModal"
        :leases="leases"
        :tenants="tenants"
        :properties="properties"
        :newPayment="newPayment"
        @close="showManualModal = false"
        @cancel="showManualModal = false"
        @submit="handleSubmitManualPayment"
    />


  </div>
</template>
