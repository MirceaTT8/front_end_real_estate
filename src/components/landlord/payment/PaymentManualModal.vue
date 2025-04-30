<script setup>
defineProps(['leases', 'newPayment', 'getPropertyName', 'getTenantName'])
defineEmits(['submit', 'cancel'])
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Record Manual Payment</h2>
        <form @submit.prevent="recordManualPayment">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Lease:</label>
            <select
                v-model="newPayment.leaseId"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option v-for="lease in leases" :key="lease.leaseId" :value="lease.leaseId">
                {{ getPropertyName(lease.propertyId) }} ({{ getTenantName(lease.tenantId) }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
                v-model.number="newPayment.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date:</label>
            <input
                v-model="newPayment.paymentDate"
                type="date"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method:</label>
            <select
                v-model="newPayment.paymentMethod"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div class="flex justify-end gap-3">
            <button
                type="button"
                @click="showManualPaymentModal = false"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm transition-colors"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

