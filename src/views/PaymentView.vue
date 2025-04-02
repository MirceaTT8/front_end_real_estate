<script setup>
import { ref, onMounted, computed } from 'vue'

// Data
const payments = ref([])
const leases = ref([])
const properties = ref([])
const tenants = ref([])
const selectedLease = ref(null)
const showManualPaymentModal = ref(false)
const newPayment = ref({
  lease_id: null,
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'bank_transfer'
})

// Mock data initialization matching your schema
const initializeData = () => {
  leases.value = [
    {
      lease_id: 1,
      tenant_id: 2, // Jane Smith
      property_id: 2, // Downtown Loft
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      monthly_rent: 1800.00,
      status: 'active',
      created_at: '2024-01-01 00:00:00'
    }
  ]

  payments.value = [
    {
      payment_id: 1,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-01-05 14:30:00',
      payment_method: 'credit_card',
      status: 'completed'
    },
    {
      payment_id: 2,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-02-05 14:30:00',
      payment_method: 'credit_card',
      status: 'completed'
    },
    {
      payment_id: 3,
      lease_id: 1,
      amount: 1800.00,
      payment_date: '2024-03-05 14:30:00',
      payment_method: 'credit_card',
      status: 'pending'
    }
  ]

  properties.value = [
    {
      property_id: 1,
      owner_id: 1,
      name: 'Sunset Apartments',
      address: '123 Main St, Cityville',
      type: 'apartment',
      rent_amount: 1200.00,
      status: 'available',
      created_at: '2024-01-01 00:00:00'
    },
    {
      property_id: 2,
      owner_id: 1,
      name: 'Downtown Loft',
      address: '456 Elm St, Metropolis',
      type: 'apartment',
      rent_amount: 1800.00,
      status: 'rented',
      created_at: '2024-01-01 00:00:00'
    }
  ]

  tenants.value = [
    {
      user_id: 1,
      last_name: 'Doe',
      first_name: 'John',
      email: 'john.doe@example.com'
    },
    {
      user_id: 2,
      last_name: 'Smith',
      first_name: 'Jane',
      email: 'jane.smith@example.com'
    }
  ]
}

// Computed properties
const filteredPayments = computed(() => {
  return selectedLease.value
      ? payments.value.filter(p => p.lease_id === selectedLease.value)
      : payments.value
})

const summary = computed(() => {
  const completedPayments = payments.value.filter(p => p.status === 'completed')
  const activeLeases = leases.value.filter(l => l.status === 'active')
  const overduePayments = payments.value.filter(
      p => p.status === 'pending' && new Date(p.payment_date) < new Date()
  )

  return {
    totalCollected: completedPayments.reduce((sum, p) => sum + p.amount, 0),
    expectedMonthly: activeLeases.reduce((sum, l) => sum + l.monthly_rent, 0),
    overdueCount: overduePayments.length
  }
})

// Helper methods
const getTenantName = (tenantId) => {
  const tenant = tenants.value.find(t => t.user_id === tenantId)
  return tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown'
}

const getPropertyName = (propertyId) => {
  const property = properties.value.find(p => p.property_id === propertyId)
  return property ? property.name : 'Unknown'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Actions
const recordManualPayment = () => {
  payments.value.push({
    payment_id: Math.max(...payments.value.map(p => p.payment_id)) + 1,
    ...newPayment.value,
    status: 'completed'
  })
  showManualPaymentModal.value = false
  resetNewPayment()
}

const resetNewPayment = () => {
  newPayment.value = {
    lease_id: null,
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer'
  }
}

const sendReminders = () => {
  alert(`Reminders sent for ${summary.value.overdueCount} overdue payments!`)
}

// Initialize
onMounted(initializeData)
</script>

<template>
  <div class="payment-view">
    <h1 class="page-title">Payment Management</h1>

    <!-- Lease Filter -->
    <div class="lease-filter">
      <label>Filter by Lease:</label>
      <select v-model="selectedLease" class="lease-select">
        <option :value="null">All Leases</option>
        <option
            v-for="lease in leases"
            :key="lease.lease_id"
            :value="lease.lease_id"
        >
          {{ getPropertyName(lease.property_id) }} - {{ getTenantName(lease.tenant_id) }}
        </option>
      </select>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <h3>Total Collected</h3>
        <p>{{ formatCurrency(summary.totalCollected) }}</p>
      </div>
      <div class="summary-card">
        <h3>Expected Monthly</h3>
        <p>{{ formatCurrency(summary.expectedMonthly) }}</p>
      </div>
      <div class="summary-card">
        <h3>Overdue Payments</h3>
        <p>{{ summary.overdueCount }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button
          @click="sendReminders"
          class="btn btn-warning"
          :disabled="summary.overdueCount === 0"
      >
        Send Reminders ({{ summary.overdueCount }})
      </button>
      <button
          @click="showManualPaymentModal = true"
          class="btn btn-primary"
      >
        Record Manual Payment
      </button>
    </div>

    <!-- Payment Table -->
    <table class="payment-table">
      <thead>
      <tr>
        <th>Payment ID</th>
        <th>Property</th>
        <th>Tenant</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Method</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="payment in filteredPayments"
          :key="payment.payment_id"
          :class="`status-${payment.status}`"
      >
        <td>{{ payment.payment_id }}</td>
        <td>
          {{ getPropertyName(leases.find(l => l.lease_id === payment.lease_id)?.property_id) }}
        </td>
        <td>
          {{ getTenantName(leases.find(l => l.lease_id === payment.lease_id)?.tenant_id) }}
        </td>
        <td>{{ formatCurrency(payment.amount) }}</td>
        <td>{{ formatDate(payment.payment_date) }}</td>
        <td>{{ payment.payment_method.replace('_', ' ') }}</td>
        <td>
            <span class="status-badge">
              {{ payment.status }}
            </span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Manual Payment Modal -->
    <div v-if="showManualPaymentModal" class="modal-overlay">
      <div class="modal">
        <h2>Record Manual Payment</h2>
        <form @submit.prevent="recordManualPayment">
          <div class="form-group">
            <label>Lease:</label>
            <select
                v-model="newPayment.lease_id"
                required
                class="form-control"
            >
              <option
                  v-for="lease in leases"
                  :key="lease.lease_id"
                  :value="lease.lease_id"
              >
                {{ getPropertyName(lease.property_id) }} ({{ getTenantName(lease.tenant_id) }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Amount:</label>
            <input
                v-model.number="newPayment.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="form-control"
            >
          </div>

          <div class="form-group">
            <label>Payment Date:</label>
            <input
                v-model="newPayment.payment_date"
                type="date"
                required
                class="form-control"
            >
          </div>

          <div class="form-group">
            <label>Payment Method:</label>
            <select
                v-model="newPayment.payment_method"
                required
                class="form-control"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div class="modal-actions">
            <button
                type="button"
                @click="showManualPaymentModal = false"
                class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.lease-filter {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lease-filter label {
  font-weight: 500;
}

.lease-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 300px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.summary-card p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
}

.btn-warning:hover {
  background-color: #e68a00;
}

.btn-warning:disabled {
  background-color: #ffd699;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.payment-table th,
.payment-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.payment-table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.status-completed {
  color: #4caf50;
}

.status-pending {
  color: #ff9800;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-completed .status-badge {
  background-color: #e8f5e9;
}

.status-pending .status-badge {
  background-color: #fff3e0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>