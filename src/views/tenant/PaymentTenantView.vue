
<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentTenantStore } from "@/stores/tenant/paymentTenantStore.js"
import { loadStripe } from "@stripe/stripe-js"
import { formatDate, formatCurrencyCompact } from '@/utils/formatters.js'
import PaymentHistory from "@/components/tenant/payment/PaymentHistory.vue"

const stripePromise = loadStripe('pk_test_51MMELpFqC40RfDoFO6Jg3gMWPzmE16VwhlDkBdaa5DlTHn7s7jtjok0zsiLT3x4v2h8TB6nTEgtg9552gtGCGsYn00Qg9p6wT4')

const paymentStore = usePaymentTenantStore()
const showPaymentModal = ref(false)

const paymentForm = ref({
  amount: 0,
  paymentMethod: 'CREDIT_CARD'
})

const submitPayment = async () => {
  try {
    await paymentStore.makePayment(paymentForm.value)
    showPaymentModal.value = false
    paymentForm.value = { amount: paymentStore.currentBalance, paymentMethod: 'CREDIT_CARD' }
  } catch (err) {
    console.error('Payment submission failed:', err)
  }
}

const handleStripeCheckout = async () => {
  try {
    const { id: sessionId } = await paymentStore.startStripeCheckout()
    const stripe = await stripePromise
    await stripe.redirectToCheckout({ sessionId })
  } catch (err) {
    console.error('Stripe Checkout failed:', err)
  }
}

onMounted(async () => {
  try {
    await paymentStore.initializePaymentData()
  } catch (error) {
    console.error('Failed to initialize payment data:', error)
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
    <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="px-6 py-8 sm:px-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Payment Center</h1>
          <p class="text-purple-100">Manage your rent payments and view payment history</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Paid This Year</p>
                <p class="text-2xl font-bold mt-1">{{ formatCurrencyCompact(paymentStore.totalPaidYTD) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Next Payment</p>
                <p v-if="paymentStore.nextPaymentDate" class="text-lg font-bold mt-1">
                  {{ formatDate(paymentStore.nextPaymentDate) }}
                </p>
                <p v-else class="text-lg font-bold mt-1">Lease Complete</p>
                <p v-if="paymentStore.nextPaymentDate" class="text-xs text-white/70">
                  {{ paymentStore.daysUntilNextPayment }} days
                </p>
                <p v-else class="text-xs text-white/70">No more payments</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Total Payments</p>
                <p class="text-2xl font-bold mt-1">{{ paymentStore.payments.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="paymentStore.loading" class="flex flex-col items-center justify-center text-center py-16">
      <div class="w-12 h-12 border-4 border-t-purple-500 border-gray-200 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">Loading your payment history...</p>
    </div>

    <div v-else-if="paymentStore.error" class="text-center text-red-600 py-16">
      <p>⚠️ {{ paymentStore.error }}</p>
      <button
          @click="paymentStore.initializePaymentData"
          class="mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">Payment Summary</h2>
        </div>
        <div class="p-6">
          <div
              class="bg-white rounded-lg p-6 shadow-md border-l-4"
              :class="paymentStore.currentBalance === 0 ? 'border-green-500' : 'border-orange-400'"
          >
            <h3 class="text-gray-500 text-sm font-medium">Rent Due</h3>
            <p class="text-3xl font-bold text-gray-800 my-2">
              {{ formatCurrencyCompact(paymentStore.currentBalance) }}
            </p>
            <p class="text-gray-600 font-medium">
              {{ paymentStore.currentBalance === 0 ? 'Rent paid for this month' : 'Due by the 5th of each month' }}
            </p>
          </div>

          <div v-if="paymentStore.currentBalance > 0" class="mt-6 flex flex-col sm:flex-row gap-4">
            <button
                @click="showPaymentModal = true"
                class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Pay with Card/Bank
            </button>
            <button
                @click="handleStripeCheckout"
                class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
              </svg>
              Pay with Stripe
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">Payment History</h2>
        </div>
        <PaymentHistory :payments="paymentStore.payments" />
      </div>
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
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              :disabled="paymentStore.loading"
          >
            <span v-if="paymentStore.loading">Processing...</span>
            <span v-else>Submit Payment</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
