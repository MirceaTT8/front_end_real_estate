<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLandlordPropertyStore } from '@/stores/propertyStore.js'
import { useLeaseStore } from "@/stores/leaseStore.js"
import { getTenantNameByLeaseId } from '@/utils/leaseNameUtils.js'

const route = useRoute()
const propertyStore = useLandlordPropertyStore()
const leaseStore = useLeaseStore()
const currentImageIndex = ref(0)
const isImageModalOpen = ref(false)
const imageLoadError = ref(false)

// Force high-quality image URL with cache busting and quality parameters
const getHighQualityImageUrl = (imageId, forceRefresh = false) => {
  const baseUrl = `http://localhost:8080/image/${imageId}`
  const params = new URLSearchParams()

  // Add quality hints (backend might respect these)
  params.append('quality', '100')
  params.append('format', 'original')

  // Cache busting for force refresh
  if (forceRefresh) {
    params.append('t', Date.now().toString())
  }

  return `${baseUrl}?${params.toString()}`
}

// Alternative: Try different API endpoints that might exist
const getAlternativeImageUrl = (imageId) => {
  // Try different possible endpoints
  const alternatives = [
    `http://localhost:8080/api/images/${imageId}`,
    `http://localhost:8080/images/${imageId}/original`,
    `http://localhost:8080/image/${imageId}/full`,
    `http://localhost:8080/files/images/${imageId}`
  ]

  return alternatives[0]
}

const statusColors = {
  AVAILABLE: { bg: 'bg-gradient-to-r from-emerald-100 to-green-100', text: 'text-emerald-800', badge: 'bg-emerald-500' },
  RENTED: { bg: 'bg-gradient-to-r from-blue-100 to-indigo-100', text: 'text-blue-800', badge: 'bg-blue-500' },
  MAINTENANCE: { bg: 'bg-gradient-to-r from-orange-100 to-red-100', text: 'text-orange-800', badge: 'bg-orange-500' },
  INACTIVE: { bg: 'bg-gradient-to-r from-gray-100 to-slate-100', text: 'text-gray-800', badge: 'bg-gray-500' }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

const nextImage = () => {
  if (!property.value?.imageUrls?.length) return
  currentImageIndex.value = (currentImageIndex.value + 1) % property.value.imageUrls.length
  imageLoadError.value = false
}

const prevImage = () => {
  if (!property.value?.imageUrls?.length) return
  currentImageIndex.value = (currentImageIndex.value - 1 + property.value.imageUrls.length) % property.value.imageUrls.length
  imageLoadError.value = false
}

const openImageModal = () => {
  isImageModalOpen.value = true
}

const closeImageModal = () => {
  isImageModalOpen.value = false
}

const handleImageError = () => {
  imageLoadError.value = true
}

const handleImageLoad = (event) => {
  const img = event.target
  img.style.imageRendering = 'high-quality'
  img.style.imageRendering = '-webkit-optimize-contrast'
  imageLoadError.value = false
}

const property = computed(() => propertyStore.selectedProperty)
const loading = computed(() => propertyStore.loading || leaseStore.loading)
const error = computed(() => propertyStore.error || leaseStore.error)

const currentLease = computed(() => {
  if (!property.value || !leaseStore.leases?.length) return null
  return leaseStore.leases.find(lease => lease.propertyId === property.value.propertyId)
})

const tenantName = computed(() => {
  if (!property.value || property.value.status !== 'RENTED') {
    return null
  }

  const leases = leaseStore.leases || []
  const tenants = leaseStore.tenants || []

  const lease = leases.find(l => l.propertyId === property.value.propertyId)
  if (!lease) return 'Unknown Lease'

  return getTenantNameByLeaseId(lease.leaseId, leases, tenants)
})

// Additional lease information
const leaseDetails = computed(() => {
  if (!currentLease.value) return null

  return {
    startDate: currentLease.value.startDate,
    endDate: currentLease.value.endDate,
    monthlyRent: currentLease.value.monthlyRent,
    securityDeposit: currentLease.value.securityDeposit,
    status: currentLease.value.status
  }
})

onMounted(async () => {
  const propertyId = Number(route.params.id)

  await propertyStore.loadPropertyById(propertyId)

  await leaseStore.loadLeases()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Back Navigation -->
      <div class="mb-8">
        <router-link
            to="/landlord/properties"
            class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
        >
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Properties
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span class="ml-4 text-gray-600 text-lg">Loading property details...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
          </svg>
          <span class="font-medium">Error loading property:</span>
          {{ error.message || error }}
        </div>
      </div>

      <!-- Property Content -->
      <div v-else-if="property" class="space-y-8">
        <!-- Hero Image Section -->
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          <!-- Main Image Display -->
          <div class="relative">
            <div class="relative min-h-[24rem] max-h-[50rem] overflow-hidden bg-gray-100 group cursor-pointer flex items-center justify-center" @click="openImageModal">
              <!-- Multiple image sources with fallbacks -->
              <picture v-if="property.imageUrls?.length && !imageLoadError">
                <!-- Try WebP format first (if your backend supports it) -->
                <source
                    :srcset="getHighQualityImageUrl(property.imageUrls[currentImageIndex]) + '&format=webp'"
                    type="image/webp"
                />
                <!-- Try PNG format -->
                <source
                    :srcset="getHighQualityImageUrl(property.imageUrls[currentImageIndex]) + '&format=png'"
                    type="image/png"
                />
                <!-- Fallback to high-quality JPEG -->
                <img
                    :src="getHighQualityImageUrl(property.imageUrls[currentImageIndex])"
                    class="max-w-full max-h-full w-auto h-auto object-contain high-quality-image"
                    alt="Property image"
                    loading="eager"
                    decoding="sync"
                    @load="handleImageLoad"
                    @error="handleImageError"
                    fetchpriority="high"
                />
              </picture>

              <!-- Alternative source fallback -->
              <img
                  v-else-if="property.imageUrls?.length && imageLoadError"
                  :src="getAlternativeImageUrl(property.imageUrls[currentImageIndex])"
                  class="max-w-full max-h-full w-auto h-auto object-contain high-quality-image"
                  alt="Property image (alternative source)"
                  loading="eager"
                  decoding="sync"
                  @load="handleImageLoad"
                  fetchpriority="high"
              />

              <!-- No images state -->
              <div v-else class="flex items-center justify-center h-full bg-gradient-to-br from-gray-200 to-gray-300">
                <div class="text-center">
                  <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-gray-500 text-lg font-medium">No images available</p>
                </div>
              </div>

              <!-- View Full Image Overlay -->
              <div v-if="property.imageUrls?.length" class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                  </svg>
                  View Full Image
                </div>
              </div>

              <!-- Navigation Arrows -->
              <button
                  v-if="property.imageUrls?.length > 1"
                  @click.stop="prevImage"
                  class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 group/btn"
              >
                <svg class="w-6 h-6 text-gray-700 group-hover/btn:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                  v-if="property.imageUrls?.length > 1"
                  @click.stop="nextImage"
                  class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 group/btn"
              >
                <svg class="w-6 h-6 text-gray-700 group-hover/btn:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Image Counter & Status Badge -->
              <div class="absolute top-6 left-6 right-6 flex justify-between items-start">
                <!-- Status Badge -->
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold shadow-lg backdrop-blur-sm"
                     :class="statusColors[property.status]?.badge">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {{ property.status.toLowerCase() }}
                </div>

                <!-- Image Counter -->
                <div v-if="property.imageUrls?.length > 1" class="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  {{ currentImageIndex + 1 }} / {{ property.imageUrls.length }}
                </div>
              </div>
            </div>

            <!-- Enhanced Thumbnail Gallery -->
            <div v-if="property.imageUrls?.length > 1" class="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                <button
                    v-for="(img, index) in property.imageUrls"
                    :key="img"
                    @click="currentImageIndex = index"
                    class="relative flex-shrink-0 h-24 w-32 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 group"
                    :class="{
                    'border-indigo-500 shadow-lg shadow-indigo-200': currentImageIndex === index,
                    'border-gray-200 hover:border-gray-300': currentImageIndex !== index
                  }"
                >
                  <img
                      :src="getHighQualityImageUrl(img)"
                      class="w-full h-full object-cover high-quality-image transition-all duration-300"
                      alt="Thumbnail"
                      loading="lazy"
                      decoding="async"
                  />
                  <div v-if="currentImageIndex === index" class="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                    <div class="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div v-else class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Property Information -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <!-- Property Title & Price -->
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div class="space-y-4">
              <h1 class="text-4xl font-bold text-gray-900 leading-tight">{{ property.name }}</h1>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-lg">{{ property.address }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Listed on {{ formatDate(property.createdAt) }}</span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-4xl font-bold text-emerald-600">{{ formatCurrency(property.rentAmount) }}</div>
              <div class="text-gray-500 font-medium">per month</div>
            </div>
          </div>

          <!-- Tenant Information for Rented Properties -->
          <div v-if="property.status === 'RENTED' && tenantName" class="p-6 rounded-xl border border-blue-200 mb-8" :class="statusColors[property.status]?.bg">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <span class="text-sm font-medium text-blue-800">Current Tenant</span>
                <p class="text-xl font-bold text-blue-900">{{ tenantName }}</p>
              </div>
            </div>

            <!-- Additional lease details if available -->
            <div v-if="leaseDetails" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="leaseDetails.startDate" class="flex justify-between">
                <span class="font-medium text-blue-800">Lease Start:</span>
                <span class="text-blue-700 font-semibold">{{ formatDate(leaseDetails.startDate) }}</span>
              </div>
              <div v-if="leaseDetails.endDate" class="flex justify-between">
                <span class="font-medium text-blue-800">Lease End:</span>
                <span class="text-blue-700 font-semibold">{{ formatDate(leaseDetails.endDate) }}</span>
              </div>
              <div v-if="leaseDetails.monthlyRent" class="flex justify-between">
                <span class="font-medium text-blue-800">Monthly Rent:</span>
                <span class="text-emerald-600 font-bold">{{ formatCurrency(leaseDetails.monthlyRent) }}</span>
              </div>
              <div v-if="leaseDetails.securityDeposit" class="flex justify-between">
                <span class="font-medium text-blue-800">Security Deposit:</span>
                <span class="text-blue-700 font-semibold">{{ formatCurrency(leaseDetails.securityDeposit) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full-Screen Image Modal with Maximum Quality -->
    <div v-if="isImageModalOpen && property?.imageUrls?.length"
         class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
         @click="closeImageModal">
      <div class="relative max-w-7xl max-h-full">
        <picture>
          <!-- Try to load uncompressed version in modal -->
          <source
              :srcset="getHighQualityImageUrl(property.imageUrls[currentImageIndex], true) + '&size=original'"
              type="image/png"
          />
          <img
              :src="getHighQualityImageUrl(property.imageUrls[currentImageIndex], true)"
              class="max-w-full max-h-full object-contain high-quality-image"
              alt="Property image full view"
              loading="eager"
              decoding="sync"
          />
        </picture>

        <!-- Close Button -->
        <button
            @click.stop="closeImageModal"
            class="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Navigation in Modal -->
        <button
            v-if="property.imageUrls.length > 1"
            @click.stop="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full hover:bg-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
            v-if="property.imageUrls.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full hover:bg-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Image Counter in Modal -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
          {{ currentImageIndex + 1 }} / {{ property.imageUrls.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Maximum image quality CSS */
.high-quality-image {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -webkit-crisp-edges;
  image-rendering: crisp-edges;
  image-rendering: high-quality;

  /* Force GPU acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;

  /* Prevent image smoothing */
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;

  /* Ensure proper fitting without cropping */
  object-fit: contain;
  object-position: center;

  /* Prevent browser optimization */
  will-change: transform;

  /* Smooth transitions for hover effects */
  transition: transform 0.7s ease-in-out;
}

/* Force no compression on canvas rendering */
.high-quality-image::before {
  content: '';
  image-rendering: pixelated;
}

/* Custom scrollbar for thumbnail gallery */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}

/* Border width utilities */
.border-3 {
  border-width: 3px;
}

/* Prevent text selection on images */
img {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

/* Force high-quality scaling */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .high-quality-image {
    image-rendering: -webkit-optimize-contrast;
  }
}
</style>