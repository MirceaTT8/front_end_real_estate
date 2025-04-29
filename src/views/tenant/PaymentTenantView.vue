<script setup>
import { ref, onMounted, computed } from 'vue'
import {getPaymentsByLeaseId, createPayment} from "@/services/paymentService.js";
import PaymentHistory from "@/components/payment-tenant/PaymentHistory.vue";

const payments = ref([])
const loading = ref(true)
const error = ref(null)
const showPaymentModal = ref(false)
const paymentForm = ref({
  amount: 1800.00,
  paymentMethod: 'CREDIT_CARD'
})

const loadPaymentData = async (leaseId) => {
  loading.value = true
  error.value = null
  try {
    payments.value = await getPaymentsByLeaseId(leaseId)
  } catch (err) {
    error.value = 'Failed to load payments. Please try again later.'
    console.error('Payment load failed:', err.message)
  } finally {
    loading.value = false
  }
}

const currentBalance = computed(() => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const hasPaidCurrentMonth = payments.value.some(payment => {
    const paymentDate = new Date(payment.paymentDate)
    return (
        paymentDate.getMonth() + 1 === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === 'COMPLETED'
    )
  })

  return hasPaidCurrentMonth ? 0 : 1800.00
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const handlePayRent = () => {
  showPaymentModal.value = true
}

const submitPayment = async () => {
  try {
    loading.value = true
    const newPayment = await createPayment(1, paymentForm.value)

    payments.value.unshift(newPayment)

    showPaymentModal.value = false
    paymentForm.value = { amount: 1800.00, paymentMethod: 'CREDIT_CARD' }

  } catch (err) {
    error.value = err.message || 'Payment failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPaymentData(1)
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-semibold text-gray-800">Rent Payment Information</h1>
      <button
          v-if="currentBalance > 0"
          @click="handlePayRent"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Pay Rent
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center text-center py-16">
      <div class="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading your payment history...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-16">
      <p>⚠️ {{ error }}</p>
      <button
          @click="loadPaymentData"
          class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <div
          class="mb-8 bg-white rounded-lg p-6 shadow-md border-l-4"
          :class="currentBalance === 0 ? 'border-green-500' : 'border-orange-400'"
      >
        <h3 class="text-gray-500 text-sm font-medium">Rent Due</h3>
        <p class="text-3xl font-bold text-gray-800 my-2">
          {{ formatCurrency(currentBalance) }}
        </p>
        <p class="text-gray-600 font-medium">
          {{ currentBalance === 0 ? 'Rent paid for this month' : 'Due by the 5th of each month' }}
        </p>
      </div>

      <PaymentHistory
          :payments="payments"
          :format-date="formatDate"
          :format-currency="formatCurrency"
      />
    </div>
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Make a Payment</h2>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Amount</label>
          <input
              v-model="paymentForm.amount"
              type="number"
              class="w-full p-2 border rounded"
              disabled
          >
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Payment Method</label>
          <select v-model="paymentForm.paymentMethod" class="w-full p-2 border rounded">
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="PAYPAL">PayPal</option>
          </select>
        </div>

        <div class="flex justify-end gap-4">
          <button
              @click="showPaymentModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
              @click="submitPayment"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              :disabled="loading"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Submit Payment</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>