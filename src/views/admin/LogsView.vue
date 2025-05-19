<script setup>
import { onMounted } from 'vue'
import { useLogStore } from '@/stores/logStore'
import LogFilters from '@/components/admin/log/LogFilters.vue'
import LogTable from '@/components/admin/log/LogTable.vue'

const logStore = useLogStore()

onMounted(() => {
  logStore.fetchLogs()
})
</script>
<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">📜 Activity Logs</h1>

    <LogFilters
        @reset="logStore.resetFilters"
        @apply="logStore.applyFilters"
    />

    <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <LogTable :logs="logStore.paginatedLogs" @sort="logStore.sortBy" />
    </div>

    <div v-if="logStore.totalPages > 1" class="flex justify-center mt-6 space-x-2">
      <button
          v-for="page in logStore.totalPages"
          :key="page"
          @click="logStore.currentPage = page"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          :class="page === logStore.currentPage ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>



<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
