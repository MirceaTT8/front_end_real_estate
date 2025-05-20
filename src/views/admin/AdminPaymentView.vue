<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePaymentAdminStore } from '@/stores/adminPaymentStore.js'

const store = usePaymentAdminStore()
const showDetails = ref(null)
const showRefundModal = ref(false)
const selectedPayment = ref(null)

const totalAmount = computed(() => {
  return store.filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)
})

const completedAmount = computed(() => {
  return store.filteredPayments
      .filter(payment => payment.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0)
      .toFixed(2)
})

const pendingAmount = computed(() => {
  return store.filteredPayments
      .filter(payment => payment.status === 'PENDING')
      .reduce((sum, payment) => sum + payment.amount, 0)
      .toFixed(2)
})

const statusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800 border border-green-200'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'FAILED': return 'bg-red-100 text-red-800 border border-red-200'
    case 'REFUNDED': return 'bg-purple-100 text-purple-800 border border-purple-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const statusDotColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-500'
    case 'PENDING': return 'bg-yellow-500'
    case 'FAILED': return 'bg-red-500'
    case 'REFUNDED': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const selectPayment = (payment) => {
  selectedPayment.value = payment
  showRefundModal.value = true
}

const refundPayment = () => {
  // Implement refund logic here
  showRefundModal.value = false
  selectedPayment.value = null
}

onMounted(() => {
  store.fetchPayments()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg">
      <div class="px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Payment Administration</h1>
              <p class="text-green-100 mt-1">Manage and track all system payments</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
                class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-green-700 text-sm font-medium rounded-xl hover:bg-green-50 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Export Payments
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Total Amount</h3>
            <p class="font-bold text-xl text-gray-800">{{ formatCurrency(totalAmount) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Completed Payments</h3>
            <p class="font-bold text-xl text-gray-800">{{ formatCurrency(completedAmount) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center gap-4">
          <div class="bg-yellow-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Pending Payments</h3>
            <p class="font-bold text-xl text-gray-800">{{ formatCurrency(pendingAmount) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">Filter Payments</h2>
        <p class="text-sm text-gray-500">Narrow down your payment records</p>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <!-- Status Filter -->
          <div class="space-y-2">
            <label for="status" class="block text-sm font-medium text-gray-700">Payment Status</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                  id="status"
                  v-model="store.filters.status"
                  class="block w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div class="space-y-2 sm:col-span-2">
            <label for="query" class="block text-sm font-medium text-gray-700">Search by ID</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                  id="query"
                  v-model="store.filters.query"
                  type="text"
                  placeholder="Search by Payment ID or Lease ID"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading and Empty States -->
    <div v-if="store.loading" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg class="animate-spin h-10 w-10 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-lg">Loading payments...</p>
      </div>
    </div>

    <div v-else-if="store.filteredPayments.length === 0" class="bg-white rounded-xl shadow-md p-10">
      <div class="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-600 font-medium mb-1">No payments found</p>
        <p class="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
      </div>
    </div>

    <!-- Payment Table -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Payment Records</h2>
          <p class="text-sm text-gray-500">{{ store.filteredPayments.length }} payments found</p>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">Last 30 Days</button>
          <button class="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500 font-medium">All Time</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lease ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
          <tr
              v-for="payment in store.filteredPayments"
              :key="payment.paymentId"
              class="hover:bg-gray-50 transition-colors"
              @click="showDetails === payment.paymentId ? showDetails = null : showDetails = payment.paymentId"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ payment.paymentId }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ payment.leaseId }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ new Date(payment.paymentDate).toLocaleDateString() }}</div>
              <div class="text-xs text-gray-500">{{ new Date(payment.paymentDate).toLocaleTimeString() }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="statusColor(payment.status)"
                >
                  <span :class="statusDotColor(payment.status)" class="w-1.5 h-1.5 mr-1.5 rounded-full"></span>
                  {{ payment.status }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                  @click.stop="selectPayment(payment)"
                  class="text-green-600 hover:text-green-900"
                  :disabled="payment.status !== 'COMPLETED'"
                  :class="{ 'opacity-50 cursor-not-allowed': payment.status !== 'COMPLETED' }"
              >
                Refund
              </button>
            </td>
          </tr>

          <!-- Expandable detail row -->
          <tr v-for="payment in store.filteredPayments" :key="`detail-${payment.paymentId}`" v-show="showDetails === payment.paymentId">
            <td colspan="6" class="px-6 py-4 bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Payment Method</h4>
                  <p class="text-sm">{{ payment.paymentMethod || 'Credit Card' }}</p>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Transaction ID</h4>
                  <p class="text-sm font-mono bg-gray-100 p-1 rounded inline-block">{{ payment.transactionId || 'TX' + payment.paymentId + '12345' }}</p>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</h4>
                  <p class="text-sm">{{ payment.notes || 'No additional notes' }}</p>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Refund Modal -->
    <div v-if="showRefundModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900">Confirm Refund</h3>
          <p class="text-gray-600 mt-1">Are you sure you want to issue a refund for this payment?</p>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                This action cannot be undone. The amount of {{ selectedPayment ? formatCurrency(selectedPayment.amount) : '' }} will be returned to the customer.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
              @click="showRefundModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
              @click="refundPayment"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Refund
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th:first-child {
  border-top-left-radius: 0.5rem;
}

thead th:last-child {
  border-top-right-radius: 0.5rem;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}
</style>