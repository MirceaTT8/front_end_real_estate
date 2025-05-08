<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPropertyById } from '@/services/propertyService.js'

const route = useRoute()
const property = ref(null)
const loading = ref(true)
const error = ref(null)
const currentImageIndex = ref(0)

const statusColors = {
  AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800' },
  RENTED: { bg: 'bg-amber-100', text: 'text-amber-800' },
  MAINTENANCE: { bg: 'bg-red-100', text: 'text-red-800' }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const nextImage = () => {
  if (!property.value?.imageUrls?.length) return
  currentImageIndex.value = (currentImageIndex.value + 1) % property.value.imageUrls.length
}

const prevImage = () => {
  if (!property.value?.imageUrls?.length) return
  currentImageIndex.value = (currentImageIndex.value - 1 + property.value.imageUrls.length) % property.value.imageUrls.length
}

onMounted(async () => {
  try {
    const propertyId = Number(route.params.id)
    property.value = await fetchPropertyById(propertyId)
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <router-link to="/landlord/properties" class="text-blue-600 hover:underline mb-4 block">← Back to Properties</router-link>

    <div v-if="loading" class="text-center py-16 text-gray-500">Loading property...</div>
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">Error: {{ error.message }}</div>

    <div v-else-if="property" class="space-y-8">
      <!-- Image Slider -->
      <div class="relative bg-gray-100 rounded overflow-hidden h-80 flex items-center justify-center">
        <img
            v-if="property.imageUrls?.length"
            :src="`http://localhost:8080/image/${property.imageUrls[currentImageIndex]}`"
            class="object-cover w-full h-full"
            alt="Property image"
        />
        <div v-else class="text-gray-400">No images available</div>

        <button @click="prevImage" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100">
          ◀
        </button>
        <button @click="nextImage" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100">
          ▶
        </button>
      </div>

      <!-- Property Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900">{{ property.name }}</h1>
          <span :class="[statusColors[property.status]?.bg, statusColors[property.status]?.text]" class="text-sm font-medium px-2 py-1 rounded capitalize">
            {{ property.status.toLowerCase() }}
          </span>
        </div>

        <div class="text-gray-700">{{ property.address }}</div>
        <div class="flex flex-wrap gap-4 text-gray-600">
          <div>{{ property.bedrooms }} {{ property.bedrooms === 1 ? 'bedroom' : 'bedrooms' }}</div>
          <div>{{ property.squareFootage }} sqft</div>
          <div>Built in {{ property.yearBuilt }}</div>
          <div>Listed on {{ formatDate(property.createdAt) }}</div>
        </div>

        <div class="text-xl font-semibold text-gray-800 mt-4">${{ property.rentAmount }}</div>
        <div class="text-sm text-gray-500">Deposit: ${{ property.depositAmount || 'N/A' }}</div>

        <p class="text-gray-700 mt-4">{{ property.description || 'No description provided.' }}</p>
      </div>

      <!-- Amenities -->
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Amenities</h2>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
          <li v-for="amenity in property.amenities || []" :key="amenity">✔ {{ amenity }}</li>
          <li v-if="!property.amenities?.length" class="text-gray-400">No amenities listed.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
