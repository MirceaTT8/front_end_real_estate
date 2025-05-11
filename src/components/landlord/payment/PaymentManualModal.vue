<script setup>
import { computed } from 'vue'

const props = defineProps({
  leases: {
    type: Array,
    default: () => []
  },
  newPayment: {
    type: Object,
    default: () => ({
      leaseId: null,
      amount: 0,
      paymentDate: '',
      paymentMethod: 'BANK_TRANSFER'
    })
  },
  getPropertyName: {
    type: Function,
    required: true
  },
  getTenantName: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isFormValid = computed(() => {
  return (
      props.newPayment.leaseId &&
      props.newPayment.amount > 0 &&
      props.newPayment.paymentDate &&
      props.newPayment.paymentMethod
  )
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Record Manual Payment</h2>

        <form @submit.prevent="emit('submit', props.newPayment)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Lease:</label>
            <select
                v-model="props.newPayment.leaseId"
                required
                class="block w-full pl-3 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option v-for="lease in props.leases" :key="lease.leaseId" :value="lease.leaseId">
                {{ props.getPropertyName(lease.propertyId) }} ({{ props.getTenantName(lease.tenantId) }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
                v-model.number="props.newPayment.amount"
                type="number"
                min="0"
                step="0.01"
                required
                class="block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date:</label>
            <input
                v-model="props.newPayment.paymentDate"
                type="date"
                required
                class="block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method:</label>
            <select
                v-model="props.newPayment.paymentMethod"
                required
                class="block w-full pl-3 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div class="flex justify-end gap-3">
            <button
                type="button"
                @click="emit('cancel')"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
                type="submit"
                :disabled="!isFormValid"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
