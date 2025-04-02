<script setup>
import {ref, onMounted, computed} from 'vue'

const lease = ref(null)
const loading = ref(true)
const error = ref(null)
const currentDate = new Date()

// Mock data structure - replace with actual API call
const loadLeaseData = async () => {
  try {
    // In a real app: lease.value = await fetchTenantLease(tenantId)
    lease.value = {
      leaseId: 1,
      property: {
        id: 2,
        name: 'Downtown Loft',
        address: '456 Elm St, Metropolis, NY 10001',
        type: 'apartment',
        amenities: ['Parking', 'Laundry', 'Gym']
      },
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 1800.00,
      paymentDueDay: 5,
      securityDeposit: 3600.00,
      status: 'active',
      utilitiesIncluded: ['Water', 'Trash'],
      specialTerms: 'Pets allowed with $500 deposit',
      paymentHistory: [
        { month: 'May 2024', amount: 1800, status: 'paid', date: '2024-05-01' },
        { month: 'April 2024', amount: 1800, status: 'paid', date: '2024-04-01' },
        { month: 'March 2024', amount: 1800, status: 'paid', date: '2024-03-01' }
      ]
    }
  } catch (err) {
    error.value = err.message || 'Failed to load lease information'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const daysRemaining = (endDate) => {
  const end = new Date(endDate)
  const diff = end - currentDate
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const rentStatus = computed(() => {
  if (!lease.value) return ''
  const dueDate = new Date(currentDate)
  dueDate.setDate(lease.value.paymentDueDay)

  return currentDate > dueDate
      ? { status: 'overdue', class: 'danger' }
      : { status: 'current', class: 'success' }
})

onMounted(() => {
  loadLeaseData()
})
</script>

<template>
  <div class="lease-tenant-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your lease information...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <button @click="loadLeaseData" class="btn btn-retry">
        Try Again
      </button>
    </div>

    <!-- Lease Content -->
    <div v-else-if="lease" class="lease-content">
      <header class="lease-header">
        <h1>Your Lease Agreement</h1>
        <div class="lease-status" :class="lease.status">
          {{ lease.status }}
        </div>
      </header>

      <!-- Property Overview -->
      <section class="property-section">
        <h2>Property Details</h2>
        <div class="property-card">
          <h3>{{ lease.property.name }}</h3>
          <p>{{ lease.property.address }}</p>
          <div class="property-details">
            <div class="detail">
              <span class="label">Type:</span>
              <span>{{ lease.property.type }}</span>
            </div>
            <div class="detail">
              <span class="label">Amenities:</span>
              <span>{{ lease.property.amenities.join(', ') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Lease Terms -->
      <section class="terms-section">
        <h2>Lease Terms</h2>
        <div class="terms-grid">
          <div class="term-card">
            <h3>Duration</h3>
            <p>{{ formatDate(lease.startDate) }} to {{ formatDate(lease.endDate) }}</p>
            <p class="highlight">{{ daysRemaining(lease.endDate) }} days remaining</p>
          </div>

          <div class="term-card">
            <h3>Rent Information</h3>
            <p><strong>Monthly Rent:</strong> ${{ lease.monthlyRent.toFixed(2) }}</p>
            <p><strong>Due Date:</strong> {{ lease.paymentDueDay }}th of each month</p>
            <p :class="rentStatus.class">Status: {{ rentStatus.status }}</p>
          </div>

          <div class="term-card">
            <h3>Deposit</h3>
            <p><strong>Security Deposit:</strong> ${{ lease.securityDeposit.toFixed(2) }}</p>
            <p v-if="lease.specialTerms.includes('Pets')">
              <strong>Pet Deposit:</strong> $500.00
            </p>
          </div>

          <div class="term-card">
            <h3>Utilities</h3>
            <p><strong>Included:</strong> {{ lease.utilitiesIncluded.join(', ') }}</p>
            <p><strong>Tenant Pays:</strong> Electricity, Internet</p>
          </div>
        </div>
      </section>

      <!-- Payment History -->
      <section class="payment-section">
        <h2>Payment History</h2>
        <div class="payment-table">
          <div class="table-header">
            <span>Month</span>
            <span>Amount</span>
            <span>Date Paid</span>
            <span>Status</span>
          </div>
          <div
              v-for="payment in lease.paymentHistory"
              :key="payment.month"
              class="table-row"
          >
            <span>{{ payment.month }}</span>
            <span>${{ payment.amount.toFixed(2) }}</span>
            <span>{{ formatDate(payment.date) }}</span>
            <span :class="payment.status">{{ payment.status }}</span>
          </div>
        </div>
      </section>

      <!-- Lease Documents -->
      <section class="documents-section">
        <h2>Lease Documents</h2>
        <div class="document-actions">
          <button class="btn btn-download">
            <span class="icon">📄</span> Download Lease Agreement
          </button>
          <button class="btn btn-download">
            <span class="icon">🏠</span> Property Rules
          </button>
        </div>
      </section>

      <!-- Important Notes -->
      <section class="notes-section">
        <h2>Important Notes</h2>
        <div class="notes-card">
          <p>{{ lease.specialTerms }}</p>
          <p>Please contact property management for any questions about your lease.</p>
        </div>
      </section>
    </div>

    <!-- No Lease State -->
    <div v-else class="empty-state">
      <p>You don't currently have an active lease.</p>
      <button class="btn btn-primary">
        Contact Property Management
      </button>
    </div>
  </div>
</template>

<style scoped>
.lease-tenant-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header */
.lease-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.lease-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.lease-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  text-transform: capitalize;
}

.lease-status.active {
  background-color: #e8f5e9;
  color: #4CAF50;
}

.lease-status.expired {
  background-color: #ffebee;
  color: #f44336;
}

/* Sections */
section {
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 1.4rem;
  color: #444;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

/* Property Card */
.property-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.property-card h3 {
  margin-top: 0;
  color: #333;
}

.property-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.detail {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #666;
}

/* Terms Grid */
.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.term-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.term-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.highlight {
  font-weight: 500;
  color: #2196F3;
}

.success {
  color: #4CAF50;
}

.danger {
  color: #f44336;
}

/* Payment Table */
.payment-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
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

/* Document Actions */
.document-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-download {
  background: #e3f2fd;
  color: #2196F3;
}

.btn-download:hover {
  background: #bbdefb;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #3d8b40;
}

.btn-retry {
  background: #ff9800;
  color: white;
}

.btn-retry:hover {
  background: #e68a00;
}

.icon {
  font-size: 1.2rem;
}

/* Notes Card */
.notes-card {
  background: #fff8e1;
  border-left: 4px solid #ffc107;
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
}

/* Loading and Error States */
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
  border-top: 5px solid #2196F3;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>