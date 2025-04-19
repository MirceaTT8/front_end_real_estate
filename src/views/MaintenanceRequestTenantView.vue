<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchMaintenanceRequestsByLease, addMaintenanceRequest } from "@/services/maintenanceService.js";

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const showCreateForm = ref(false)
const newRequest = ref({
  description: '',
  attachments: []
})
const fileInput = ref(null)

// Status filter
const statusFilter = ref('PENDING')
const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ALL', label: 'All Requests' }
]

// Filtered requests
const filteredRequests = computed(() => {
  if (statusFilter.value === 'ALL') return requests.value
  return requests.value.filter(request => request.status === statusFilter.value)
})

// Status display options
const statusDisplay = {
  PENDING: { label: 'Pending', color: 'orange' },
  IN_PROGRESS: { label: 'In Progress', color: 'blue' },
  COMPLETED: { label: 'Completed', color: 'green' }
}

// Load tenant's maintenance requests
const loadRequests = async () => {
  try {
    loading.value = true
    requests.value = await fetchMaintenanceRequestsByLease(1)
  } catch (err) {
    error.value = err.message || 'Failed to load maintenance requests'
  } finally {
    loading.value = false
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    newRequest.value.attachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
  }
}

// Submit new maintenance request
const submitRequest = async () => {
  try {
    loading.value = true
    error.value = null

    const requestDTO = {
      description: newRequest.value.description,
      attachments: newRequest.value.attachments,
    }

    const createdRequest = await addMaintenanceRequest(1, requestDTO)
    requests.value.unshift(createdRequest)
    showCreateForm.value = false
    newRequest.value = { description: '', attachments: [] }
  } catch (err) {
    error.value = err.message || 'Failed to submit request'
  } finally {
    loading.value = false
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
  <div class="max-w-4xl mx-auto p-6">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
      <div class="flex gap-4">
        <select
            v-model="statusFilter"
            class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-green-400"
        >
          <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <button
            @click="showCreateForm = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
            v-if="!showCreateForm"
        >
          + New Request
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center space-y-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
      <p class="text-gray-600">Loading your requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600">
      <p>⚠️ {{ error }}</p>
      <button
          @click="loadRequests"
          class="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
      >
        Try Again
      </button>
    </div>

    <!-- Create New Request Form -->
    <div v-else-if="showCreateForm" class="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 class="text-xl font-semibold text-gray-700">Create Maintenance Request</h2>
      <form @submit.prevent="submitRequest" class="space-y-4">
        <div>
          <label for="description" class="block font-medium text-gray-700 mb-1">Description *</label>
          <textarea
              id="description"
              v-model="newRequest.description"
              required
              rows="5"
              placeholder="Describe the issue in detail..."
              class="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:ring-green-400"
          ></textarea>
        </div>

        <div>
          <label class="block font-medium text-gray-700 mb-1">Attach Photos (Max 5)</label>
          <input
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <div class="mt-4 flex flex-wrap gap-4" v-if="newRequest.attachments.length > 0">
            <div
                v-for="(attachment, index) in newRequest.attachments"
                :key="index"
                class="relative w-24 h-24 border rounded overflow-hidden"
            >
              <img :src="attachment.preview" alt="Preview" class="object-cover w-full h-full" />
              <button
                  type="button"
                  @click="newRequest.attachments.splice(index, 1)"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-2 py-0.5 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
              type="button"
              @click="showCreateForm = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            Submit Request
          </button>
        </div>
      </form>
    </div>

    <!-- Request List -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="filteredRequests.length === 0" class="text-center text-gray-600">
        <p v-if="statusFilter === 'ALL'">You haven't submitted any maintenance requests yet.</p>
        <p v-else>No {{ statusFilter.toLowerCase() }} requests found.</p>
        <button
            @click="showCreateForm = true"
            class="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Create New Request
        </button>
      </div>

      <!-- Request Cards -->
      <div v-else class="space-y-6">
        <div
            v-for="request in filteredRequests"
            :key="request.requestId"
            class="bg-white shadow rounded-lg p-6"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Request #{{ request.requestId }}</h3>
            <span
                class="text-sm font-medium px-3 py-1 rounded-full"
                :class="{
                'bg-orange-100 text-orange-700': request.status === 'PENDING',
                'bg-blue-100 text-blue-700': request.status === 'IN_PROGRESS',
                'bg-green-100 text-green-700': request.status === 'COMPLETED'
              }"
            >
              {{ statusDisplay[request.status].label }}
            </span>
          </div>

          <p class="text-gray-700 mb-4">{{ request.description }}</p>

          <!-- Attachments -->
          <div v-if="request.imageUrls?.length" class="mb-4">
            <h4 class="font-medium text-gray-700 mb-2">
              Attached Photos ({{ request.imageUrls.length }})
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                  v-for="(imageId, index) in request.imageUrls"
                  :key="index"
                  class="w-full aspect-square border rounded overflow-hidden"
              >
                <img
                    :src="`http://localhost:8080/image/${imageId}`"
                    :alt="`Attachment ${index + 1}`"
                    class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="text-sm text-gray-600 space-y-1">
            <div><span class="font-medium">Submitted:</span> {{ formatDate(request.createdAt) }}</div>
            <div><span class="font-medium">Last Updated:</span> {{ formatDate(request.updatedAt) }}</div>
            <div v-if="request.status === 'completed'">
              <span class="font-medium">Resolution Time:</span> {{ request.resolution_time }} days
            </div>
            <div v-if="request.status === 'completed'">
              <span class="font-medium">Fixed?:</span> {{ request.is_fixed ? 'Yes' : 'No' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>