<script setup>
import { getPropertyNameByLeaseId, getTenantNameByLeaseId } from '@/utils/leaseNameUtils.js'
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
  <div class="bg-white shadow rounded overflow-x-auto">
    <table class="min-w-full table-auto">
      <thead class="bg-gray-100 text-gray-700 text-left text-sm">
      <tr>
        <th class="px-4 py-3">Payment ID</th>
        <th class="px-4 py-3">Property</th>
        <th class="px-4 py-3">Tenant</th>
        <th class="px-4 py-3">Date</th>
        <th class="px-4 py-3">Amount</th>
        <th class="px-4 py-3">Method</th>
        <th class="px-4 py-3">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-if="loading"
          class="text-center text-gray-500"
      >
        <td colspan="7" class="py-6">Loading payments...</td>
      </tr>
      <tr
          v-for="payment in payments"
          :key="payment.paymentId"
          class="border-t"
      >
        <td class="px-4 py-2">{{ payment.paymentId }}</td>
        <td class="px-4 py-2">{{ getPropertyName(payment.leaseId) }}</td>
        <td class="px-4 py-2">{{ getTenantName(payment.leaseId) }}</td>
        <td class="px-4 py-2">{{ formatDate(payment.paymentDate) }}</td>
        <td class="px-4 py-2">${{ payment.amount.toFixed(2) }}</td>
        <td class="px-4 py-2">{{ payment.paymentMethod }}</td>
        <td class="px-4 py-2 capitalize">
          <span
              :class="payment.status === 'COMPLETED'
                ? 'text-green-600 font-medium'
                : 'text-yellow-600 font-medium'"
          >
            {{ payment.status }}
          </span>
        </td>
      </tr>
      <tr
          v-if="!loading && payments.length === 0"
          class="text-center text-gray-500"
      >
        <td colspan="7" class="py-6">No payments to show.</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>