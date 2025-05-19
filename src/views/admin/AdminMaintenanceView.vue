<script setup>
import { ref, onMounted } from 'vue'
import { useMaintenanceAdminStore } from '@/stores/adminMaintenanceStore.js'
import MaintenanceFilters from '@/components/admin/maintenance/MaintenanceFilters.vue'
import MaintenanceTable from '@/components/admin/maintenance/MaintenanceTable.vue'
import MaintenanceImageModal from '@/components/admin/maintenance/MaintenanceImageModal.vue'
import PaginationControls from "@/components/PaginationControls.vue";

const store = useMaintenanceAdminStore()

const showModal = ref(false)
const modalImageIds = ref([])

const openImageModal = (ids) => {
  modalImageIds.value = ids
  showModal.value = true
}

const updateFilters = (newFilters) => {
  store.filters = newFilters
}

const sortBy = (field) => {
  store.setSort(field)
}

onMounted(() => {
  store.fetchRequests()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Maintenance Requests</h1>

    <MaintenanceFilters :filters="store.filters" @update:filters="updateFilters" />

    <div v-if="store.loading" class="text-gray-500">Loading maintenance requests...</div>
    <div v-else-if="store.filteredRequests.length === 0" class="text-gray-600">No maintenance requests match your filters.</div>

    <MaintenanceTable
        v-else
        :requests="store.filteredRequests"
        :sort-field="store.sortField"
        :sort-direction="store.sortDirection"
        @sort="sortBy"
        @view-images="openImageModal"
    />

    <PaginationControls
        :current-page="store.currentPage"
        :total-pages="store.totalPages"
        @update:currentPage="store.currentPage = $event"
    />

    <MaintenanceImageModal :images="modalImageIds" :show="showModal" @close="showModal = false" />
  </div>
</template>
