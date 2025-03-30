<script setup>
import { ref, onMounted } from 'vue'
import { fetchPropertiesByUserId } from '@/services/propertyService.js'

const properties = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    properties.value = await fetchPropertiesByUserId(1) // Replace with actual user ID
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-semibold text-gray-800 mb-8">My Properties</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="text-gray-600">Loading your properties...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-700">
      <span class="text-xl">⚠️</span>
      <p>Error loading properties: {{ error.message }}</p>
    </div>

    <!-- Properties Grid -->
    <div v-if="!loading && !error">
      <div v-if="properties.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 class="text-xl text-gray-600 mb-2">No properties found</h3>
        <p class="text-gray-500">You don't have any properties listed yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="property in properties" :key="property.id" class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <div class="h-48 overflow-hidden">
            <img
                :src="property.image || '@/assets/property-placeholder.jpg'"
                alt="Property image"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            >
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ property.name }}</h3>
              <span
                  :class="{
                  'bg-green-50 text-green-800': property.status === 'available',
                  'bg-amber-50 text-amber-800': property.status === 'occupied',
                  'bg-red-50 text-red-800': property.status === 'maintenance'
                }"
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              >
                {{ property.status }}
              </span>
            </div>
            <div class="flex justify-between mb-4">
              <p class="flex items-center text-gray-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ property.address }}
              </p>
              <p class="flex items-center text-green-700 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${{ property.monthlyRent }} <span class="text-gray-500 font-normal">/month</span>
              </p>
            </div>
            <p class="text-gray-600 text-sm line-clamp-3 mb-6">{{ property.description }}</p>
            <div class="flex justify-end">
              <button class="flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>