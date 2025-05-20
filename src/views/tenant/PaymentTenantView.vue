onMounted(async () => {
await paymentStore.fetchPayments()
paymentForm.value.amount = paymentStore.currentBalance
})<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePaymentTenantStore } from "@/stores/paymentTenantStore.js"
import { loadStripe } from '@stripe/stripe-js'
import PaymentHistory from '@/components/tenant/payment/PaymentHistory.vue'

const stripePromise = loadStripe('pk_test_51MMELpFqC40RfDoFO6Jg3gMWPzmE16VwhlDkBdaa5DlTHn7s7jtjok0zsiLT3x4v2h8TB6nTEgtg9552gtGCGsYn00Qg9p6wT4')
const paymentStore = usePaymentTenantStore()

const showPaymentModal = ref(false)
const paymentForm = ref({
  amount: 0,
  paymentMethod: 'CREDIT_CARD'
})
const activeTab = ref('overview')

const paymentMethods = ref([
  { id: 'card', name: 'Credit Card', icon: 'credit-card', selected: true },
  { id: 'bank', name: 'Bank Transfer', icon: 'bank', selected: false }
])

// Using the nextPaymentDate from the store, which matches LeaseTenantView logic
const nextPaymentDate = computed(() => {
  return paymentStore.nextPaymentDate;
});

const daysUntilNextPayment = computed(() => {
  return paymentStore.daysUntilNextPayment;
});

// Use totalPaidYTD directly from the store
const totalPaid = computed(() => {
  return paymentStore.totalPaidYTD;
});

// Payment history for current year - use from store
const paymentsByMonth = computed(() => {
  return paymentStore.paymentsByMonth;
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const selectPaymentMethod = (id) => {
  paymentMethods.value.forEach(method => {
    method.selected = method.id === id;
    if (method.selected) {
      switch(method.id) {
        case 'card':
          paymentForm.value.paymentMethod = 'CREDIT_CARD';
          break;
        case 'bank':
          paymentForm.value.paymentMethod = 'BANK_TRANSFER';
          break;
      }
    }
  });
}

const handleStripeCheckout = async () => {
  try {
    const { id: sessionId } = await paymentStore.startStripeCheckout()
    const stripe = await stripePromise
    await stripe.redirectToCheckout({ sessionId })
  } catch (err) {
    console.error('Stripe Checkout failed:', err)
    paymentStore.error.value = err.message || 'Failed to start Stripe checkout.'
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="px-6 py-8 sm:px-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Payment Center</h1>
            <p class="text-indigo-100 mt-1">Manage your rent payments and payment history</p>
          </div>

          <div v-if="!paymentStore.loading && !paymentStore.hasPaidThisCycle" class="mt-4 md:mt-0">
            <button
                @click="showPaymentModal = true"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-purple-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Make Payment
            </button>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Balance Card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Current Balance</p>
                <p class="text-2xl font-bold mt-1">{{ formatCurrency(paymentStore.currentBalance) }}</p>
              </div>
            </div>
          </div>

          <!-- Next Payment Card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Next Payment Due</p>
                <p class="text-2xl font-bold mt-1">{{ daysUntilNextPayment }} days</p>
                <p class="text-xs mt-1 text-white/70">{{ formatDate(nextPaymentDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Total Paid Card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div class="flex items-center">
              <div class="p-3 bg-white/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Total Paid YTD</p>
                <p class="text-2xl font-bold mt-1">{{ formatCurrency(totalPaid) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
              @click="activeTab = 'overview'"
              class="w-full py-4 px-1 text-center border-b-2 font-medium text-sm"
              :class="activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Payment Overview
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="paymentStore.loading" class="p-8">
        <div class="flex flex-col items-center justify-center text-center py-16">
          <div class="w-12 h-12 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading your payment information...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="paymentStore.error" class="p-8">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ paymentStore.error }}</p>
              <div class="mt-4">
                <button
                    @click="paymentStore.fetchPayments"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-else class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div class="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 class="text-lg font-medium text-gray-900">Payment Statistics</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p class="text-sm text-gray-500">Total Paid (YTD)</p>
                  <p class="text-xl font-bold text-gray-900 mt-1">{{ formatCurrency(totalPaid) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Payments Made</p>
                  <p class="text-xl font-bold text-gray-900 mt-1">{{ paymentStore.payments.filter(p => p.status === 'COMPLETED').length }}</p>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <p class="text-sm text-gray-500 mb-4">Payment History (This Year)</p>

                <!-- Simple Bar Chart -->
                <div class="h-32 flex items-end space-x-2">
                  <div
                      v-for="(amount, index) in paymentsByMonth"
                      :key="index"
                      class="bg-indigo-200 rounded-t w-full"
                      :class="{ 'bg-indigo-500': amount > 0 }"
                      :style="{ height: amount > 0 ? `${Math.min(100, (amount / Math.max(...paymentsByMonth)) * 100)}%` : '4px' }"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Payments -->
          <div class="mt-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
            <PaymentHistory :payments="paymentStore.payments" />
          </div>
        </div>
      </div>
    </div>

    <!-- Make Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Make a Payment</h2>
          <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
                v-model="paymentForm.amount"
                type="number"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">Current balance: {{ formatCurrency(paymentStore.currentBalance) }}</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div class="grid grid-cols-2 gap-3">
            <div
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectPaymentMethod(method.id)"
                class="relative border rounded-md px-4 py-3 flex flex-col items-center cursor-pointer focus:outline-none"
                :class="method.selected ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'"
            >
              <span class="flex items-center justify-center h-10 w-10 rounded-full mb-2" :class="method.selected ? 'bg-indigo-100' : 'bg-gray-100'">
                <svg v-if="method.icon === 'credit-card'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="method.selected ? 'text-indigo-600' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <svg v-if="method.icon === 'bank'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="method.selected ? 'text-indigo-600' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </span>
              <span class="text-xs font-medium" :class="method.selected ? 'text-indigo-900' : 'text-gray-900'">{{ method.name }}</span>

              <span v-if="method.selected" class="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center">
                <svg class="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
              @click="showPaymentModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
              @click="handleStripeCheckout"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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