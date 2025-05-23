<script setup>
import { getPropertyNameByLeaseId, getTenantNameByLeaseId } from '@/utils/leaseNameUtils.js'
import { formatPaymentMethod } from '@/utils/paymentUtils.js'
import { computed } from 'vue'

const props = defineProps({
  payments: Array,
  leases: Array,
  tenants: Array,
  properties: Array,
  loading: Boolean
})

const getTenantName = (leaseId) =>
    getTenantNameByLeaseId(leaseId, props.leases, props.tenants)

const getPropertyName = (leaseId) =>
    getPropertyNameByLeaseId(leaseId, props.leases, props.properties)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
    <table class="min-w-full table-auto">
      <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <tr>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
      <tr
          v-if="loading"
          class="text-center text-gray-500"
      >
        <td colspan="7" class="px-6 py-12 text-sm">
          <div class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span>Loading payments...</span>
          </div>
        </td>
      </tr>
      <tr
          v-for="payment in payments"
          :key="payment.paymentId"
          class="hover:bg-gray-50 transition-colors duration-150"
      >
        <td class="px-6 py-4 text-sm font-mono text-gray-900">{{ payment.paymentId }}</td>
        <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ getPropertyName(payment.leaseId) }}</td>
        <td class="px-6 py-4 text-sm text-gray-700">{{ getTenantName(payment.leaseId) }}</td>
        <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(payment.paymentDate) }}</td>
        <td class="px-6 py-4 text-sm font-semibold text-gray-900">${{ payment.amount.toFixed(2) }}</td>
        <td class="px-6 py-4 text-sm text-gray-600">{{ formatPaymentMethod(payment.paymentMethod) }}</td>
        <td class="px-6 py-4 text-sm">
          <span
              :class="payment.status === 'COMPLETED'
                ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'"
          >
            {{ payment.status }}
          </span>
        </td>
      </tr>
      <tr
          v-if="!loading && payments.length === 0"
          class="text-center text-gray-500"
      >
        <td colspan="7" class="px-6 py-12 text-sm">
          <div class="flex flex-col items-center">
            <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-gray-600 font-medium">No payments to show</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>