<script setup>
import {ref, onMounted, computed} from 'vue'
import {createWebHistory as $router} from "vue-router";

// Mock data - replace with actual API calls
const requests = ref([])
const loading = ref(true)
const error = ref(null)
const selectedStatus = ref('all')

const fetchMaintenanceRequests = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          request_id: 1,
          lease_id: 1,
          description: 'Kitchen sink is leaking',
          status: 'pending',
          created_at: '2024-05-01 09:30:00',
          updated_at: '2024-05-01 09:30:00',
          tenant_name: 'Jane Smith',
          property_address: '456 Elm St, Metropolis'
        },
        {
          request_id: 2,
          lease_id: 1,
          description: 'AC not cooling properly',
          status: 'in_progress',
          created_at: '2024-05-10 14:15:00',
          updated_at: '2024-05-11 10:00:00',
          tenant_name: 'Jane Smith',
          property_address: '456 Elm St, Metropolis'
        },
        {
          request_id: 3,
          lease_id: 2,
          description: 'Broken window in bedroom',
          status: 'resolved',
          created_at: '2024-04-15 16:45:00',
          updated_at: '2024-04-18 11:30:00',
          tenant_name: 'Mike Johnson',
          property_address: '123 Main St, Cityville'
        }
      ])
    }, 800)
  })
}

// Initialize data
onMounted(async () => {
  try {
    requests.value = await fetchMaintenanceRequests()
  } catch (err) {
    error.value = err.message || 'Failed to load maintenance requests'
  } finally {
    loading.value = false
  }
})

// Filter requests by status
const filteredRequests = computed(() => {
  if (selectedStatus.value === 'all') return requests.value
  return requests.value.filter(req => req.status === selectedStatus.value)
})

// Update request status
const updateRequestStatus = (requestId, newStatus) => {
  const request = requests.value.find(req => req.request_id === requestId)
  if (request) {
    request.status = newStatus
    request.updated_at = new Date().toISOString()
    // Here you would normally make an API call to update the status
    console.log(`Updated request ${requestId} to ${newStatus}`)
  }
}

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="maintenance-view">
    <header class="page-header">
      <h1>Maintenance Requests</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading maintenance requests...</p>
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
      <!-- Status Filter -->
      <div class="status-filter">
        <label>Filter by status:</label>
        <select v-model="selectedStatus" class="status-select">
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <!-- Request List -->
      <div v-if="filteredRequests.length > 0" class="request-list">
        <div v-for="request in filteredRequests" :key="request.request_id" class="request-card">
          <div class="request-header">
            <h3>Request #{{ request.request_id }}</h3>
            <span class="request-status" :class="request.status">
              {{ request.status.replace('_', ' ') }}
            </span>
          </div>

          <div class="request-details">
            <div class="detail-row">
              <span class="detail-label">Property:</span>
              <span class="detail-value">{{ request.property_address }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tenant:</span>
              <span class="detail-value">{{ request.tenant_name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Description:</span>
              <span class="detail-value">{{ request.description }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">{{ formatDate(request.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ formatDate(request.updated_at) }}</span>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="request-actions">
            <template v-if="request.status === 'pending'">
              <button
                  @click="updateRequestStatus(request.request_id, 'in_progress')"
                  class="btn btn-primary"
              >
                Mark In Progress
              </button>
              <button
                  @click="updateRequestStatus(request.request_id, 'cancelled')"
                  class="btn btn-warning"
              >
                Cancel Request
              </button>
            </template>

            <template v-else-if="request.status === 'in_progress'">
              <button
                  @click="updateRequestStatus(request.request_id, 'resolved')"
                  class="btn btn-success"
              >
                Mark Resolved
              </button>
              <button
                  @click="updateRequestStatus(request.request_id, 'pending')"
                  class="btn btn-secondary"
              >
                Revert to Pending
              </button>
            </template>

            <template v-else-if="request.status === 'resolved'">
              <button
                  @click="updateRequestStatus(request.request_id, 'in_progress')"
                  class="btn btn-secondary"
              >
                Reopen
              </button>
            </template>

            <template v-else-if="request.status === 'cancelled'">
              <button
                  @click="updateRequestStatus(request.request_id, 'pending')"
                  class="btn btn-secondary"
              >
                Reactivate
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">🔧</div>
        <h3>No maintenance requests found</h3>
        <p>There are no {{ selectedStatus === 'all' ? '' : selectedStatus.replace('_', ' ') + ' ' }}requests at this time.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-filter label {
  font-weight: 500;
}

.status-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 200px;
}

.request-list {
  display: grid;
  gap: 1.5rem;
}

.request-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.request-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.request-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.request-status.pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.request-status.in_progress {
  background-color: #e3f2fd;
  color: #2196f3;
}

.request-status.resolved {
  background-color: #e8f5e9;
  color: #4caf50;
}

.request-status.cancelled {
  background-color: #ffebee;
  color: #f44336;
}

.request-details {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
}

.detail-label {
  font-weight: 500;
  min-width: 120px;
  color: #666;
}

.detail-value {
  flex: 1;
}

.request-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover {
  background: #0d8bf2;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #3d8b40;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover {
  background: #e68a00;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
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
  border-top: 4px solid #2196f3;
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