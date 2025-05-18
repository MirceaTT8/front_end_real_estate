<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMaintenanceTenantStore } from "@/stores/leaseMaintenanceTenantStore.js";
import MaintenanceListTenant from '@/components/tenant/maintenance/MaintenanceListTenant.vue'
import MaintenanceCreateForm from '@/components/tenant/maintenance/MaintenanceCreateForm.vue'
import MaintenanceFilter from '@/components/tenant/maintenance/MaintenanceFilter.vue'
import MaintenanceHeader from '@/components/tenant/maintenance/MaintenanceHeader.vue'

const maintenanceStore = useMaintenanceTenantStore()

const showCreateForm = ref(false)
const statusFilter = ref('PENDING')

const filteredRequests = computed(() => {
  if (statusFilter.value === 'ALL') return maintenanceStore.requests
  return maintenanceStore.requests.filter(request => request.status === statusFilter.value)
})

const loadRequests = async () => {
  await maintenanceStore.fetchRequests()
}

const submitRequest = async (newRequest) => {
  await maintenanceStore.createRequest(newRequest)
  showCreateForm.value = false
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
        :loading="maintenanceStore.loading"
        :error="maintenanceStore.error"
        :status-filter="statusFilter"
        @create-new="showCreateForm = true"
        @retry="loadRequests"
    />
  </div>
</template>
