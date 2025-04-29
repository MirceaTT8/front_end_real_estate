<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  property: {
    type: Object,
    required: true
  }
})

const statusColors = {
  AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800' },
  RENTED: { bg: 'bg-amber-100', text: 'text-amber-800' },
  MAINTENANCE: { bg: 'bg-red-100', text: 'text-red-800' }
}

const navigateToDetails = (id) => {
  const numericId = Number(id)
  if (isNaN(numericId)) {
    console.error('Invalid property ID:', id)
    return
  }

  router.push(`/landlord/property/${numericId}`)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
    <!-- Property Images -->
    <div v-if="property.imageUrls?.length" class="h-48 overflow-hidden relative cursor-pointer" @click="navigateToDetails(property.id)">
      <img
          :src="`http://localhost:8080/image/${property.imageUrls[0]}`"
          alt="Property image"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      >
      <div v-if="property.imageUrls.length > 1" class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        +{{ property.imageUrls.length - 1 }} more
      </div>
    </div>
    <div v-else class="h-48 overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer" @click="navigateToDetails(property.id)">
      <img
          src="@/assets/logo.svg"
          alt="Property placeholder"
          class="w-full h-full object-cover"
      >
    </div>

    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium text-gray-900">{{ property.name }}</h3>
        <span
            :class="[statusColors[property.status].bg, statusColors[property.status].text]"
            class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
        >
          {{ property.status.toLowerCase() }}
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
          ${{ property.rentAmount }} <span class="text-gray-500 font-normal">/month</span>
        </p>
      </div>

      <!-- Image Gallery Section -->
      <div v-if="property.imageUrls?.length > 1" class="mb-4">
        <h4 class="font-medium text-gray-700 mb-2 text-sm">
          Property Photos ({{ property.imageUrls.length }})
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div
              v-for="(imageId, index) in property.imageUrls.slice(0, 3)"
              :key="index"
              class="aspect-square border rounded overflow-hidden cursor-pointer"
              @click="navigateToDetails(property.propertyId)"
          >
            <img
                :src="`http://localhost:8080/image/${imageId}`"
                :alt="`Property photo ${index + 1}`"
                class="w-full h-full object-cover"
            >
          </div>
          <div
              v-if="property.imageUrls.length > 3"
              class="aspect-square border rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm cursor-pointer"
              @click="navigateToDetails(property.propertyId)"
          >
            +{{ property.imageUrls.length - 3 }} more
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
            @click="navigateToDetails(property.propertyId)"
            class="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </button>
      </div>
    </div>
  </div>
</template>