<script setup>
defineProps(['filteredPayments', 'getLeaseForPayment', 'getPropertyName', 'getTenantName', 'formatCurrency', 'formatDate'])
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr
          v-for="payment in filteredPayments"
          :key="payment.paymentId"
          :class="{
            'text-green-600': payment.status === 'completed',
            'text-amber-600': payment.status === 'pending'
          }"
      >
        <td class="px-6 py-4 text-sm">{{ payment.paymentId }}</td>
        <td class="px-6 py-4 text-sm">{{ getPropertyName(getLeaseForPayment(payment)?.propertyId) }}</td>
        <td class="px-6 py-4 text-sm">{{ getTenantName(getLeaseForPayment(payment)?.tenantId) }}</td>
        <td class="px-6 py-4 text-sm">{{ formatCurrency(payment.amount) }}</td>
        <td class="px-6 py-4 text-sm">{{ formatDate(payment.paymentDate) }}</td>
        <td class="px-6 py-4 text-sm capitalize">{{ payment.paymentMethod.replace('_', ' ') }}</td>
        <td class="px-6 py-4 text-sm">
            <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="{
                'bg-green-100 text-green-800': payment.status === 'completed',
                'bg-amber-100 text-amber-800': payment.status === 'pending'
              }"
            >
              {{ payment.status }}
            </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

