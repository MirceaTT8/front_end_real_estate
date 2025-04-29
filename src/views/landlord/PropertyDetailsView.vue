<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPropertyById } from '@/services/propertyService.js'

const route = useRoute()
const propertyId = route.params.id

const property = ref(null)
const loading = ref(true)
const error = ref(null)
const showImageModal = ref(false)
const currentImage = ref('')

const statusColors = {
  AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800' },
  RENTED: { bg: 'bg-amber-100', text: 'text-amber-800' },
  MAINTENANCE: { bg: 'bg-red-100', text: 'text-red-800' }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const openImageModal = (imageId) => {
  currentImage.value = imageId
  showImageModal.value = true
}

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})
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
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <router-link
        to="/landlord/properties"
        class="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Properties
    </router-link>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="text-gray-600">Loading property details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-700">
      <span class="text-xl">⚠️</span>
      <p>Error loading property: {{ error.message }}</p>
    </div>

    <!-- Property Details -->
    <div v-else-if="property" class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Image Gallery -->
      <div class="relative">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div class="lg:col-span-2 h-96 bg-gray-100">
            <img
                v-if="property.imageUrls?.length"
                :src="`http://localhost:8080/image/${property.imageUrls[0]}`"
                alt="Main property image"
                class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <img src="@/assets/logo.svg" alt="Property placeholder" class="w-32 h-32 opacity-30">
            </div>
          </div>
          <div class="hidden lg:grid grid-rows-2 gap-0">
            <div
                v-for="(image, index) in property.imageUrls?.slice(1, 3)"
                :key="index"
                class="h-48 bg-gray-100"
            >
              <img
                  :src="`http://localhost:8080/image/${image}`"
                  :alt="`Property image ${index + 2}`"
                  class="w-full h-full object-cover"
              >
            </div>
            <div
                v-if="property.imageUrls?.length > 3"
                class="h-48 bg-gray-800 text-white flex items-center justify-center"
            >
              <span class="text-xl font-medium">+{{ property.imageUrls.length - 3 }} more photos</span>
            </div>
          </div>
        </div>
        <div
            v-if="property.imageUrls?.length > 3"
            class="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm"
        >
          {{ property.imageUrls.length }} photos
        </div>
      </div>

      <!-- Property Info Section -->
      <div class="p-6 lg:p-8">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ property.name }}</h1>
              <span
                  :class="[statusColors[property.status].bg, statusColors[property.status].text]"
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              >
                {{ property.status.toLowerCase() }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-gray-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ property.address }}</span>
            </div>

            <div class="flex items-center gap-4 mb-6">
              <div class="flex items-center gap-1 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="capitalize">{{ property.type.toLowerCase() }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <span>{{ property.bedrooms }} {{ property.bedrooms === 1 ? 'bedroom' : 'bedrooms' }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Listed on {{ formatDate(property.createdAt) }}</span>
              </div>
            </div>

            <div class="prose max-w-none text-gray-700 mb-6">
              <p>{{ property.description || 'No description provided.' }}</p>
            </div>
          </div>

          <div class="lg:w-80 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-600">Monthly Rent</span>
              <span class="text-2xl font-bold text-gray-900">${{ property.rentAmount }}</span>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Deposit</span>
                <span class="font-medium">${{ property.depositAmount || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Square Feet</span>
                <span class="font-medium">{{ property.squareFootage || 'N/A' }} sqft</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Year Built</span>
                <span class="font-medium">{{ property.yearBuilt || 'N/A' }}</span>
              </div>
            </div>

            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Contact Owner
            </button>
          </div>
        </div>

        <!-- Amenities Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
                v-for="amenity in property.amenities || []"
                :key="amenity"
                class="flex items-center gap-2 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="capitalize">{{ amenity.toLowerCase() }}</span>
            </div>
            <div v-if="!property.amenities?.length" class="text-gray-500 col-span-full">
              No amenities listed.
            </div>
          </div>
        </div>

        <!-- Additional Images -->
        <div v-if="property.imageUrls?.length > 3" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">More Photos</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
                v-for="(image, index) in property.imageUrls.slice(3)"
                :key="index"
                class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                  :src="`http://localhost:8080/image/${image}`"
                  :alt="`Property image ${index + 4}`"
                  class="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  @click="openImageModal(image)"
              >
            </div>
          </div>
        </div>

        <!-- Map Section -->
        <div class="h-96 bg-gray-100 rounded-lg overflow-hidden">
          <div class="h-full w-full flex items-center justify-center">
            <p class="text-gray-500">Map view would be displayed here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
        v-if="showImageModal"
        class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        @click.self="showImageModal = false"
    >
      <button
          @click="showImageModal = false"
          class="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
          :src="`http://localhost:8080/image/${currentImage}`"
          alt="Enlarged property image"
          class="max-w-full max-h-full object-contain"
      >
    </div>
  </div>
</template>