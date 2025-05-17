<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Payments</h1>

    <div v-if="loading" class="text-gray-500">Loading payments...</div>
    <div v-else-if="payments.length === 0" class="text-gray-600">No payments found.</div>

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
      <tr v-for="payment in payments" :key="payment.id" class="border-t">
        <td class="px-4 py-2">{{ payment.id }}</td>
        <td class="px-4 py-2">{{ payment.leaseId }}</td>
        <td class="px-4 py-2">${{ payment.amount.toFixed(2) }}</td>
        <td class="px-4 py-2">{{ new Date(payment.date).toLocaleDateString() }}</td>
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

<script setup>
import { ref, onMounted } from 'vue'
import { getAllPayments } from '@/services/paymentService'

const payments = ref([])
const loading = ref(true)

const statusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-500'
    case 'PENDING': return 'bg-yellow-500'
    case 'FAILED': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

onMounted(async () => {
  try {
    payments.value = await getAllPayments()
  } catch (err) {
    console.error('Failed to fetch payments:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
th, td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
