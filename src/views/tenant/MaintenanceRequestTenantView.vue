<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchMaintenanceRequestsByLease, addMaintenanceRequest } from "@/services/maintenanceService.js";
import MaintenanceListTenant from "@/components/tenant/maintenance/MaintenanceListTenant.vue";
import MaintenanceCreateForm from "@/components/tenant/maintenance/MaintenanceCreateForm.vue";
import MaintenanceFilter from "@/components/tenant/maintenance/MaintenanceFilter.vue";
import MaintenanceHeader from "@/components/tenant/maintenance/MaintenanceHeader.vue";

const requests = ref([])
const loading = ref(true)
const error = ref(null)
const showCreateForm = ref(false)
const statusFilter = ref('PENDING')

const filteredRequests = computed(() => {
  if (statusFilter.value === 'ALL') return requests.value
  return requests.value.filter(request => request.status === statusFilter.value)
})

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

const submitRequest = async (newRequest) => {
  try {
    loading.value = true
    error.value = null

    const requestDTO = {
      description: newRequest.description,
      attachments: newRequest.attachments,
    }
    console.log(requestDTO)

    const createdRequest = await addMaintenanceRequest(1, requestDTO)
    requests.value.unshift(createdRequest)
    showCreateForm.value = false
  } catch (err) {
    error.value = err.message || 'Failed to submit request'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequests()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <MaintenanceHeader
        :show-create-button="!showCreateForm"
        @create-new="showCreateForm = true"
    />

        <div class="flex justify-end mb-4" v-if="!showCreateForm">
          <MaintenanceFilter v-model="statusFilter" />
        </div>

    <MaintenanceCreateForm
        v-if="showCreateForm"
        @submit="submitRequest"
        @cancel="showCreateForm = false"
    />

    <MaintenanceListTenant
          v-else
          :requests="filteredRequests"
          :loading="loading"
          :error="error"
          :status-filter="statusFilter"
          @create-new="showCreateForm = true"
          @retry="loadRequests"
      />
  </div>
</template>