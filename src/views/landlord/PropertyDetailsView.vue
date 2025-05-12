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
    <router-link to="/landlord/properties" class="text-blue-600 hover:underline mb-6 inline-block">
      ← Back to Properties
    </router-link>

    <div v-if="loading" class="text-center py-20 text-gray-500 text-lg">Loading property...</div>
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg shadow">Error: {{ error.message }}</div>

    <div v-else-if="property" class="bg-white shadow-md rounded-2xl p-6 space-y-8">
      <!-- Image Slider -->
      <div class="relative rounded-xl overflow-hidden h-96 bg-gray-100 flex items-center justify-center">
        <img
            v-if="property.imageUrls?.length"
            :src="`http://localhost:8080/image/${property.imageUrls[currentImageIndex]}`"
            class="object-cover w-full h-full transition duration-300 ease-in-out"
            alt="Property image"
        />
        <div v-else class="text-gray-400 text-lg">No images available</div>

        <button @click="prevImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition">
          ◀
        </button>
        <button @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition">
          ▶
        </button>
      </div>

      <!-- Thumbnails -->
      <div v-if="property.imageUrls?.length" class="flex gap-2 overflow-x-auto mt-2">
        <img
            v-for="(img, index) in property.imageUrls"
            :key="img"
            :src="`http://localhost:8080/image/${img}`"
            @click="currentImageIndex = index"
            class="h-16 w-24 object-cover rounded-lg border-2 cursor-pointer transition hover:scale-105"
            :class="{
            'border-blue-500': currentImageIndex === index,
            'border-transparent': currentImageIndex !== index
          }"
            alt="Thumbnail"
        />
      </div>

      <!-- Property Info -->
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-semibold text-gray-900">{{ property.name }}</h1>
          <span :class="[statusColors[property.status]?.bg, statusColors[property.status]?.text]"
                class="text-sm font-medium px-3 py-1 rounded-full capitalize">
            {{ property.status.toLowerCase() }}
          </span>
        </div>

        <div class="text-gray-600 text-lg">{{ property.address }}</div>
        <div class="text-sm text-gray-500">Listed on {{ formatDate(property.createdAt) }}</div>

        <div class="text-2xl font-bold text-green-700 mt-4">${{ property.rentAmount }}</div>
      </div>
    </div>
  </div>
</template>



<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
