<script setup>
import { ref, onMounted } from 'vue'
import { fetchAllPropertiesAdmin } from '@/services/propertyService'

const properties = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    properties.value = await fetchAllPropertiesAdmin()
  } catch (err) {
    error.value = 'Failed to load properties.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🏢 Admin Property Management</h1>

    <div v-if="loading" class="text-gray-500">Loading properties...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="properties.length === 0" class="text-gray-600">No properties found.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="property in properties"
          :key="property.id"
          class="bg-white border rounded-lg shadow p-4"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ property.title }}</h2>
        <p class="text-sm text-gray-600 mb-2">{{ property.address }}</p>
        <p class="text-sm text-gray-500">ID: {{ property.propertyId }}</p>
        <p class="text-sm text-gray-500">Units: {{ property.unitCount }}</p>
        <p class="text-sm text-gray-500">Status: {{ property.status }}</p>
      </div>
    </div>
  </div>
</template>

