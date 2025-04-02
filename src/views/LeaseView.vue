<script setup>
import { ref, onMounted, computed } from 'vue'

// Mock data - replace with your actual API calls
const leases = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('active')

// Simulated API call
const fetchActiveLeasesByOwnerId = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          leaseId: 1,
          tenantId: 2,
          tenantName: 'Jane Smith',
          propertyId: 2,
          propertyName: 'Downtown Loft',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 1800.00,
          status: 'active'
        },
        {
          leaseId: 2,
          tenantId: 3,
          tenantName: 'Mike Johnson',
          propertyId: 1,
          propertyName: 'Sunset Apartments',
          startDate: '2024-02-15',
          endDate: '2024-12-31',
          monthlyRent: 1200.00,
          status: 'active'
        },
        {
          leaseId: 3,
          tenantId: 4,
          tenantName: 'Sarah Williams',
          propertyId: 3,
          propertyName: 'Lakeside Villa',
          startDate: '2023-06-01',
          endDate: '2023-12-31',
          monthlyRent: 2000.00,
          status: 'terminated'
        }
      ])
    }, 800)
  })
}

// Initialize data
onMounted(async () => {
  try {
    leases.value = await fetchActiveLeasesByOwnerId()
  } catch (err) {
    error.value = err.message || 'Failed to load leases'
  } finally {
    loading.value = false
  }
})

// Computed properties
const filteredLeases = computed(() => {
  return leases.value.filter(lease =>
      activeTab.value === 'all' ||
      lease.status === activeTab.value
  )
})

const totalMonthlyRent = computed(() => {
  return leases.value
      .filter(l => l.status === 'active')
      .reduce((sum, lease) => sum + lease.monthlyRent, 0)
})

const statusColors = {
  active: { bg: '#e8f5e9', text: '#4CAF50' },
  terminated: { bg: '#ffebee', text: '#f44336' },
  pending: { bg: '#fff3e0', text: '#ff9800' }
}

// Actions
const handleTerminate = (leaseId) => {
  console.log('Terminating lease:', leaseId)
  // Add your termination logic here
}
</script>

<template>
  <div class="lease-view">
    <!-- Header -->
    <header class="page-header">
      <h1>Lease Management</h1>
      <router-link to="/leases/new" class="btn btn-primary">
        + Add New Lease
      </router-link>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading leases...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <button @click="$router.go(0)" class="btn btn-secondary">
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <h3>Total Leases</h3>
          <p>{{ leases.length }}</p>
        </div>
        <div class="summary-card">
          <h3>Active Leases</h3>
          <p>{{ leases.filter(l => l.status === 'active').length }}</p>
        </div>
        <div class="summary-card highlight">
          <h3>Monthly Revenue</h3>
          <p>${{ totalMonthlyRent.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Lease Tabs -->
      <div class="lease-tabs">
        <button
            @click="activeTab = 'active'"
            :class="{ active: activeTab === 'active' }"
        >
          Active
        </button>
        <button
            @click="activeTab = 'terminated'"
            :class="{ active: activeTab === 'terminated' }"
        >
          Terminated
        </button>
        <button
            @click="activeTab = 'all'"
            :class="{ active: activeTab === 'all' }"
        >
          All Leases
        </button>
      </div>

      <!-- Lease List -->
      <div v-if="filteredLeases.length > 0" class="lease-list">
        <div v-for="lease in filteredLeases" :key="lease.leaseId" class="lease-card">
          <div class="lease-header">
            <h3>
              Lease #{{ lease.leaseId }}
              <span
                  class="status-badge"
                  :style="{
                  backgroundColor: statusColors[lease.status].bg,
                  color: statusColors[lease.status].text
                }"
              >
                {{ lease.status }}
              </span>
            </h3>
            <span class="lease-amount">${{ lease.monthlyRent }}/month</span>
          </div>

          <div class="lease-details">
            <div class="detail-group">
              <span class="detail-label">Property:</span>
              <router-link
                  :to="`/properties/${lease.propertyId}`"
                  class="detail-value link"
              >
                {{ lease.propertyName || `Property #${lease.propertyId}` }}
              </router-link>
            </div>

            <div class="detail-group">
              <span class="detail-label">Tenant:</span>
              <router-link
                  :to="`/tenants/${lease.tenantId}`"
                  class="detail-value link"
              >
                {{ lease.tenantName || `Tenant #${lease.tenantId}` }}
              </router-link>
            </div>

            <div class="detail-group">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">
                {{ new Date(lease.startDate).toLocaleDateString() }} -
                {{ new Date(lease.endDate).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="lease-actions">
            <router-link
                :to="`/leases/${lease.leaseId}`"
                class="btn btn-outline"
            >
              View Details
            </router-link>
            <button
                v-if="lease.status === 'active'"
                class="btn btn-warning"
                @click="handleTerminate(lease.leaseId)"
            >
              Terminate
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>No leases found</h3>
        <p>You don't have any {{ activeTab }} leases yet.</p>
        <router-link to="/leases/new" class="btn btn-primary">
          Create New Lease
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lease-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary-card.highlight {
  border-left: 4px solid #4CAF50;
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

.lease-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.lease-tabs button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  position: relative;
}

.lease-tabs button.active {
  color: #4CAF50;
}

.lease-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4CAF50;
}

.lease-list {
  display: grid;
  gap: 1.5rem;
}

.lease-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lease-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.lease-header h3 {
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lease-amount {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.lease-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: 500;
}

.link {
  color: #2196F3;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.lease-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-outline {
  background: white;
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.btn-outline:hover {
  background: #f5f5f5;
}

.btn-warning {
  background: #ff9800;
  color: white;
  border: none;
}

.btn-warning:hover {
  background: #e68a00;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: none;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  background: #ffebee;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.error-state p {
  margin: 0 0 1rem 0;
  color: #f44336;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #666;
}
</style>