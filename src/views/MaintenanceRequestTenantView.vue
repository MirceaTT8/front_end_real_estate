<script setup>
import { ref, onMounted } from 'vue'

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const showCreateForm = ref(false)
const newRequest = ref({
  description: '',
  urgency: 'medium' // low, medium, high
})

// Status options that tenant can see (can't see cancelled/completed)
const statusDisplay = {
  pending: { label: 'Pending', color: 'orange' },
  in_progress: { label: 'In Progress', color: 'blue' },
  resolved: { label: 'Resolved', color: 'green' }
}

// Load tenant's maintenance requests
const loadRequests = async () => {
  try {
    loading.value = true
    // Replace with actual API call
    requests.value = [
      {
        request_id: 1,
        description: 'Kitchen sink is leaking',
        status: 'pending',
        created_at: '2024-05-15 09:30:00',
        updated_at: '2024-05-15 09:30:00'
      },
      {
        request_id: 2,
        description: 'AC not cooling properly',
        status: 'in_progress',
        created_at: '2024-05-10 14:15:00',
        updated_at: '2024-05-11 10:00:00'
      },
      {
        request_id: 3,
        description: 'Broken bedroom window',
        status: 'resolved',
        created_at: '2024-04-20 16:45:00',
        updated_at: '2024-04-22 11:30:00'
      }
    ]
  } catch (err) {
    error.value = err.message || 'Failed to load maintenance requests'
  } finally {
    loading.value = false
  }
}

// Submit new maintenance request
const submitRequest = async () => {
  try {
    // In a real app: await createMaintenanceRequest(newRequest.value)
    const newId = Math.max(...requests.value.map(r => r.request_id), 0) + 1

    requests.value.unshift({
      request_id: newId,
      description: newRequest.value.description,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    showCreateForm.value = false
    newRequest.value = { description: '', urgency: 'medium' }
  } catch (err) {
    error.value = err.message || 'Failed to submit request'
  }
}

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  loadRequests()
})
</script>

<template>
  <div class="maintenance-tenant-view">
    <header class="page-header">
      <h1>Maintenance Requests</h1>
      <button
          @click="showCreateForm = true"
          class="btn btn-primary"
          v-if="!showCreateForm"
      >
        + New Request
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <button @click="loadRequests" class="btn btn-retry">
        Try Again
      </button>
    </div>

    <!-- Create New Request Form -->
    <div v-else-if="showCreateForm" class="create-form">
      <h2>Create Maintenance Request</h2>
      <form @submit.prevent="submitRequest">
        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
              id="description"
              v-model="newRequest.description"
              required
              rows="5"
              placeholder="Describe the issue in detail..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>Urgency Level</label>
          <div class="urgency-options">
            <label>
              <input
                  type="radio"
                  v-model="newRequest.urgency"
                  value="low"
              >
              <span class="urgency-tag low">Low</span>
            </label>
            <label>
              <input
                  type="radio"
                  v-model="newRequest.urgency"
                  value="medium"
                  checked
              >
              <span class="urgency-tag medium">Medium</span>
            </label>
            <label>
              <input
                  type="radio"
                  v-model="newRequest.urgency"
                  value="high"
              >
              <span class="urgency-tag high">High</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button
              type="button"
              @click="showCreateForm = false"
              class="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Submit Request
          </button>
        </div>
      </form>
    </div>

    <!-- Request List -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="requests.length === 0" class="empty-state">
        <p>You haven't submitted any maintenance requests yet.</p>
        <button
            @click="showCreateForm = true"
            class="btn btn-primary"
        >
          Create Your First Request
        </button>
      </div>

      <!-- Request Cards -->
      <div v-else class="request-list">
        <div
            v-for="request in requests"
            :key="request.request_id"
            class="request-card"
        >
          <div class="request-header">
            <h3>Request #{{ request.request_id }}</h3>
            <span
                class="status-badge"
                :style="{
                backgroundColor: `var(--color-${statusDisplay[request.status].color}-light)`,
                color: `var(--color-${statusDisplay[request.status].color}-dark)`
              }"
            >
              {{ statusDisplay[request.status].label }}
            </span>
          </div>

          <div class="request-details">
            <p class="description">{{ request.description }}</p>

            <div class="meta-details">
              <div class="meta-item">
                <span class="meta-label">Submitted:</span>
                <span>{{ formatDate(request.created_at) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Last Updated:</span>
                <span>{{ formatDate(request.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-tenant-view {
  max-width: 800px;
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

/* Form Styles */
.create-form {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.create-form h2 {
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

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.urgency-options {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.urgency-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.urgency-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.urgency-tag.low {
  background-color: #e8f5e9;
  color: #4CAF50;
}

.urgency-tag.medium {
  background-color: #fff3e0;
  color: #ff9800;
}

.urgency-tag.high {
  background-color: #ffebee;
  color: #f44336;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Request List */
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

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.request-details {
  display: grid;
  gap: 1rem;
}

.description {
  margin: 0;
  line-height: 1.5;
}

.meta-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
}

.meta-label {
  font-weight: 500;
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
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-state p {
  margin-bottom: 1.5rem;
}
</style>