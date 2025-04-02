<script setup>
import { ref, onMounted, computed } from 'vue'

const payments = ref([])
const loading = ref(true)
const error = ref(null)
const showPaymentModal = ref(false)
const paymentForm = ref({
  amount: '',
  paymentMethod: 'bank_transfer',
  leaseId: null // Will be set to the active lease
})

// Mock data - replace with actual API calls
const loadPaymentData = async () => {
  try {
    // Simulate API call
    payments.value = [
      {
        payment_id: 1,
        lease_id: 1,
        amount: 1800.00,
        payment_date: '2024-05-01 10:30:00',
        payment_method: 'bank_transfer',
        status: 'completed',
        invoice_id: 'INV-2024-05-001'
      },
      {
        payment_id: 2,
        lease_id: 1,
        amount: 1800.00,
        payment_date: '2024-04-01 09:15:00',
        payment_method: 'credit_card',
        status: 'completed',
        invoice_id: 'INV-2024-04-001'
      },
      {
        payment_id: 3,
        lease_id: 1,
        amount: 1800.00,
        payment_date: '2024-03-01 14:45:00',
        payment_method: 'bank_transfer',
        status: 'completed',
        invoice_id: 'INV-2024-03-001'
      }
    ]

    // Set the active lease ID for payment form
    paymentForm.value.leaseId = 1
  } catch (err) {
    error.value = err.message || 'Failed to load payment history'
  } finally {
    loading.value = false
  }
}

// Current balance calculation
const currentBalance = computed(() => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Check if current month's payment exists
  const hasPaidCurrentMonth = payments.value.some(payment => {
    const paymentDate = new Date(payment.payment_date)
    return (
        paymentDate.getMonth() + 1 === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === 'completed'
    )
  })

  return hasPaidCurrentMonth ? 0 : 1800.00 // Replace with actual rent amount
})

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Submit payment
const processPayment = async () => {
  try {
    // In a real app: await submitPayment(paymentForm.value)
    const newPayment = {
      payment_id: Math.max(...payments.value.map(p => p.payment_id), 0) + 1,
      lease_id: paymentForm.value.leaseId,
      amount: parseFloat(paymentForm.value.amount),
      payment_date: new Date().toISOString(),
      payment_method: paymentForm.value.paymentMethod,
      status: 'pending',
      invoice_id: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
    }

    payments.value.unshift(newPayment)
    showPaymentModal.value = false
    paymentForm.value.amount = ''
  } catch (err) {
    error.value = err.message || 'Payment failed. Please try again.'
  }
}

onMounted(() => {
  loadPaymentData()
})
</script>

<template>
  <div class="payment-tenant-view">
    <header class="page-header">
      <h1>Payment History</h1>
      <button
          v-if="currentBalance > 0"
          @click="showPaymentModal = true"
          class="btn btn-primary"
      >
        Pay Rent
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your payment history...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <button @click="loadPaymentData" class="btn btn-retry">
        Try Again
      </button>
    </div>

    <!-- Payment Status -->
    <div v-else class="payment-status">
      <div class="balance-card" :class="{ 'paid': currentBalance === 0 }">
        <h3>Current Balance</h3>
        <p class="balance-amount">
          {{ formatCurrency(currentBalance) }}
        </p>
        <p class="balance-status">
          {{ currentBalance === 0 ? 'Rent paid for this month' : 'Payment due' }}
        </p>
      </div>
    </div>

    <!-- Payment History -->
    <div class="payment-history">
      <h2>Payment History</h2>

      <!-- Empty State -->
      <div v-if="payments.length === 0" class="empty-state">
        <p>No payment history found</p>
      </div>

      <!-- Payment Table -->
      <div v-else class="payment-table">
        <div class="table-header">
          <span>Date</span>
          <span>Amount</span>
          <span>Method</span>
          <span>Status</span>
          <span>Invoice</span>
        </div>

        <div
            v-for="payment in payments"
            :key="payment.payment_id"
            class="table-row"
        >
          <span>{{ formatDate(payment.payment_date) }}</span>
          <span>{{ formatCurrency(payment.amount) }}</span>
          <span>{{ payment.payment_method.replace('_', ' ') }}</span>
          <span :class="payment.status">{{ payment.status }}</span>
          <span class="invoice-link">
            <a href="#" @click.prevent="console.log('Download invoice', payment.invoice_id)">
              Download
            </a>
          </span>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="payment-modal">
      <div class="modal-content">
        <h2>Make a Payment</h2>
        <form @submit.prevent="processPayment">
          <div class="form-group">
            <label>Lease ID</label>
            <input
                v-model="paymentForm.leaseId"
                type="text"
                disabled
                class="form-control"
            >
          </div>

          <div class="form-group">
            <label>Amount to Pay</label>
            <input
                v-model.number="paymentForm.amount"
                type="number"
                min="0.01"
                step="0.01"
                :max="currentBalance"
                required
                class="form-control"
                placeholder="Enter amount"
            >
            <small class="hint">Current balance: {{ formatCurrency(currentBalance) }}</small>
          </div>

          <div class="form-group">
            <label>Payment Method</label>
            <select
                v-model="paymentForm.paymentMethod"
                required
                class="form-control"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>

          <div class="form-actions">
            <button
                type="button"
                @click="showPaymentModal = false"
                class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!paymentForm.amount || paymentForm.amount <= 0"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-tenant-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #3d8b40;
}

.btn-primary:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-retry {
  background-color: #ff9800;
  color: white;
}

.btn-retry:hover {
  background-color: #e68a00;
}

/* Payment Status */
.payment-status {
  margin-bottom: 2rem;
}

.balance-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid #ff9800;
}

.balance-card.paid {
  border-left-color: #4CAF50;
}

.balance-card h3 {
  margin-top: 0;
  color: #666;
  font-size: 1.1rem;
}

.balance-amount {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #333;
}

.balance-status {
  margin: 0;
  color: #666;
  font-weight: 500;
}

/* Payment History */
.payment-history {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.payment-history h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

/* Payment Table */
.payment-table {
  display: grid;
  grid-template-columns: 1fr;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  align-items: center;
}

.table-header {
  background: #f5f5f5;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.table-row {
  border-bottom: 1px solid #f5f5f5;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .completed {
  color: #4CAF50;
  font-weight: 500;
}

.table-row .pending {
  color: #ff9800;
  font-weight: 500;
}

.table-row .failed {
  color: #f44336;
  font-weight: 500;
}

.invoice-link a {
  color: #2196F3;
  text-decoration: none;
}

.invoice-link a:hover {
  text-decoration: underline;
}

/* Payment Modal */
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #f44336;
}

.empty-state {
  background: #fafafa;
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem 0;
}
</style>