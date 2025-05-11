<script setup>
import { useRouter } from 'vue-router'
import { formatDate, formatCurrency } from '@/components/utils/formatters.js'

const props = defineProps({
  payments: Array
})

const router = useRouter()
const firstThree = props.payments.slice(0, 3)
const extraPayments = props.payments.slice(3)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Payment History</h2>

    <div v-if="payments.length === 0" class="bg-gray-50 text-gray-500 py-12 text-center rounded-md">
      <p>No payment history found</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-5 font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-t-md">
        <span>Date</span>
        <span>Amount</span>
        <span>Method</span>
        <span>Status</span>
        <span>Invoice</span>
      </div>

      <div
          v-for="payment in firstThree"
          :key="'p1-' + payment.paymentId"
          class="grid grid-cols-5 px-4 py-3 border-t items-center text-sm"
      >
        <span>{{ formatDate(payment.paymentDate) }}</span>
        <span>{{ formatCurrency(payment.amount) }}</span>
        <span class="capitalize">{{ payment.paymentMethod.replace('_', ' ') }}</span>
        <span
            :class="{
            'text-green-600 font-semibold': payment.status === 'completed',
            'text-orange-500 font-semibold': payment.status === 'pending',
            'text-red-600 font-semibold': payment.status === 'failed'
          }"
        >
          {{ payment.status }}
        </span>
        <span>
          <a
              href="#"
              @click.prevent="console.log('Download invoice', payment.invoiceId)"
              class="text-blue-600 hover:underline"
          >
            View
          </a>
        </span>
      </div>

      <div
          v-for="payment in extraPayments"
          :key="'p2-' + payment.paymentId"
          class="grid grid-cols-5 px-4 py-3 border-t items-center text-sm opacity-50 cursor-pointer hover:opacity-75 transition"
          @click="router.push('/tenant/payments')"
      >
        <span>{{ formatDate(payment.paymentDate) }}</span>
        <span>{{ formatCurrency(payment.amount) }}</span>
        <span class="capitalize">{{ payment.paymentMethod.replace('_', ' ') }}</span>
        <span>{{ payment.status }}</span>
        <span>View</span>
      </div>

      <div v-if="extraPayments.length" class="mt-4 text-right">
        <button
            @click="router.push('/tenant/payments')"
            class="text-sm text-green-600 hover:underline"
        >
          View all payments →
        </button>
      </div>
    </div>
  </div>
</template>
