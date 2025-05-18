<script setup>
import {onMounted, ref} from 'vue'
import { usePaymentLandlordStore } from "@/stores/paymentStore.js";
import PaymentSummaryCard from '@/components/landlord/payment/PaymentSummaryCard.vue'
import PaymentTable from '@/components/landlord/payment/PaymentTable.vue'
import PaymentManualModal from '@/components/landlord/payment/PaymentManualModal.vue'
import PaymentLeaseFilter from '@/components/landlord/payment/PaymentLeaseFilter.vue'

const store = usePaymentLandlordStore()
const showManualModal = ref(false)
const newPayment = ref({
  leaseId: null,
  amount: 0,
  paymentDate: '',
  paymentMethod: 'BANK_TRANSFER'
})

const handleSubmitManualPayment = async (payment) => {
  await store.submitManualPayment(payment)
  showManualModal.value = false
}

onMounted(() => {
  store.loadPayments()
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

    <div v-if="store.error" class="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-4">
      {{ store.error }}
    </div>

    <PaymentSummaryCard :payments="store.filteredPayments" />

    <PaymentLeaseFilter
        :payments="store.payments"
        :leases="store.leases"
        v-model:selectedLeaseId="store.selectedLeaseId"
    />

    <PaymentTable
        :payments="store.filteredPayments"
        :leases="store.leases"
        :tenants="store.tenants"
        :properties="store.properties"
        :loading="store.loading"
    />

    <PaymentManualModal
        v-if="showManualModal"
        :leases="store.leases"
        :tenants="store.tenants"
        :properties="store.properties"
        :newPayment="newPayment"
        @close="showManualModal = false"
        @cancel="showManualModal = false"
        @submit="handleSubmitManualPayment"
    />
  </div>
</template>
