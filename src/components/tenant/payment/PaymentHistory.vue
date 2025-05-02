<script setup>
defineProps({
  payments: Array
})

import {formatDate} from "@/components/landlord/utils/formatters.js";
import {formatCurrency} from "@/components/landlord/utils/formatters.js";
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
          v-for="payment in payments"
          :key="payment.paymentId"
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
    </div>
  </div>
</template>