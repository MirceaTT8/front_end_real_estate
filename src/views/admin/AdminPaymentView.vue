<script setup>
import { onMounted } from 'vue'
import { usePaymentAdminStore } from '@/stores/adminPaymentStore.js'

const store = usePaymentAdminStore()

const statusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-500'
    case 'PENDING': return 'bg-yellow-500'
    case 'FAILED': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

onMounted(() => {
  store.fetchPayments()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Payments</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-end">
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
            id="status"
            v-model="store.filters.status"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm"
        >
          <option value="ALL">All</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div class="flex-1">
        <label for="query" class="block text-sm font-medium text-gray-700 mb-1">Search (Payment or Lease ID)</label>
        <input
            id="query"
            v-model="store.filters.query"
            type="text"
            placeholder="e.g. 12345"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm"
        />
      </div>
    </div>

    <!-- Table -->
    <div v-if="store.loading" class="text-gray-500">Loading payments...</div>
    <div v-else-if="store.filteredPayments.length === 0" class="text-gray-600">No payments match your filters.</div>

    <table v-else class="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left">Payment ID</th>
        <th class="px-4 py-2 text-left">Lease ID</th>
        <th class="px-4 py-2 text-left">Amount</th>
        <th class="px-4 py-2 text-left">Date</th>
        <th class="px-4 py-2 text-left">Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="payment in store.filteredPayments" :key="payment.paymentId" class="border-t">
        <td class="px-4 py-2">{{ payment.paymentId }}</td>
        <td class="px-4 py-2">{{ payment.leaseId }}</td>
        <td class="px-4 py-2">${{ payment.amount.toFixed(2) }}</td>
        <td class="px-4 py-2">{{ new Date(payment.paymentDate).toLocaleDateString() }}</td>
        <td class="px-4 py-2">
            <span :class="statusColor(payment.status)" class="px-2 py-1 rounded text-white text-sm">
              {{ payment.status }}
            </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th, td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
