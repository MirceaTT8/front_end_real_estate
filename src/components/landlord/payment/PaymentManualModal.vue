<script setup>
import { computed, watch, ref } from 'vue'
import {
  getPropertyNameByLeaseId,
  getTenantNameByLeaseId
} from '@/utils/leaseNameUtils.js'
import { isPaymentMadeThisCycle } from '@/services/paymentService.js' // Adjust path as needed

const props = defineProps({
  leases: Array,
  newPayment: Object,
  properties: Array,
  tenants: Array
})

const emit = defineEmits(['submit', 'cancel'])

const isLeaseActive = ref(true)
const alreadyPaid = ref(false)
const errorMsg = ref('')

// Automatically set amount and validate lease on selection
watch(
    () => props.newPayment.leaseId,
    async (leaseId) => {
      if (!leaseId) return

      const selectedLease = props.leases.find(lease => lease.leaseId === leaseId)

      if (!selectedLease) return

      isLeaseActive.value = selectedLease.status === 'ACTIVE'

      try {
        alreadyPaid.value = await isPaymentMadeThisCycle(leaseId)
      } catch (error) {
        alreadyPaid.value = false
        console.error('Failed to check payment status:', error)
      }

      if (!isLeaseActive.value) {
        errorMsg.value = 'This lease is not active.'
      } else if (alreadyPaid.value) {
        errorMsg.value = 'Payment has already been made for this billing cycle.'
      } else {
        errorMsg.value = ''
        props.newPayment.amount = selectedLease.monthlyRent
      }
    }
)

const isFormValid = computed(() =>
    props.newPayment.leaseId &&
    props.newPayment.amount > 0 &&
    props.newPayment.paymentDate &&
    props.newPayment.paymentMethod &&
    isLeaseActive.value &&
    !alreadyPaid.value
)

const resolvePropertyName = (leaseId) =>
    getPropertyNameByLeaseId(leaseId, props.leases, props.properties)

const resolveTenantName = (leaseId) =>
    getTenantNameByLeaseId(leaseId, props.leases, props.tenants)
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
              <option
                  v-for="lease in props.leases.filter(
      l => l.status === 'ACTIVE' && l.terminationStatus !== 'APPROVED'
    )"
                  :key="lease.leaseId"
                  :value="lease.leaseId"
              >
                {{ resolvePropertyName(lease.leaseId) }} ({{ resolveTenantName(lease.leaseId) }})
              </option>
            </select>

          </div>

          <div v-if="errorMsg" class="text-sm text-red-600 mb-3">
            {{ errorMsg }}
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
                v-model.number="props.newPayment.amount"
                type="number"
                min="0"
                step="0.01"
                required
                readonly
                class="block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
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
