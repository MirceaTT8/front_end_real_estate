<script setup>
defineProps({
  show: Boolean,
  paymentForm: Object,
  loading: Boolean
});

const emit = defineEmits(['update:show', 'submit']);
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Make a Payment</h2>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Amount</label>
        <input
            v-model="paymentForm.amount"
            type="number"
            class="w-full p-2 border rounded"
            disabled
        >
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 mb-2">Payment Method</label>
        <select v-model="paymentForm.paymentMethod" class="w-full p-2 border rounded">
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="PAYPAL">PayPal</option>
        </select>
      </div>

      <div class="flex justify-end gap-4">
        <button
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
            @click="$emit('submit')"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            :disabled="loading"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Submit Payment</span>
        </button>
      </div>
    </div>
  </div>
</template>