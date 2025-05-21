<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SwiperCore from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { setMaintenanceCost } from '@/services/maintenanceService.js'
import { getTenantNameByLeaseId, getPropertyNameByLeaseId} from "@/utils/leaseNameUtils.js";

SwiperCore.use([Navigation, Pagination])

const emit = defineEmits(['update-status'])

const { request, leases, tenants, properties } = defineProps({
  request: Object,
  leases: Array,
  tenants: Array,
  properties: Array
});

// Status configurations for visual styling and icons
const statusDisplay = {
  PENDING: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />'
  },
  IN_PROGRESS: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />'
  },
  COMPLETED: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
  },
  CANCELLED: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />'
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleString(undefined, options)
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
}

const isRecentlyUpdated = (updatedAt) => {
  const updated = new Date(updatedAt)
  const now = new Date()
  return (now - updated) / (1000 * 60 * 60) < 24
}

const showModal = ref(false)
const activeIndex = ref(0)

const openSlider = (index) => {
  activeIndex.value = index
  showModal.value = true
}

const cost = ref(request.cost || '')
const isSaving = ref(false)
const saveError = ref(null)
const isCostSaved = computed(() => !!request.cost)

const saveCost = async () => {
  if (!cost.value || isNaN(cost.value)) {
    saveError.value = 'Please enter a valid number'
    return
  }

  try {
    isSaving.value = true
    saveError.value = null
    await setMaintenanceCost(request.requestId, parseFloat(cost.value))
    request.cost = parseFloat(cost.value) // mark as saved in UI
  } catch (err) {
    saveError.value = 'Failed to save cost'
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

// Format currency with dollar sign and 2 decimal places
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}
</script>

<template>
  <div class="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
    <!-- Card Header with Status -->
    <div class="px-6 py-4 relative" :class="[statusDisplay[request.status].border, statusDisplay[request.status].bg]">
      <!-- Request ID Badge -->
      <div class="absolute -top-3 -left-3">
        <div class="bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-700 border shadow-sm">
          #{{ request.requestId }}
        </div>
      </div>

      <!-- Status Badge -->
      <div class="flex justify-end mb-2">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium capitalize shadow-sm"
             :class="[statusDisplay[request.status].bg, statusDisplay[request.status].text, 'border', statusDisplay[request.status].border]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-html="statusDisplay[request.status].icon"></svg>
          {{ request.status.replace('_', ' ').toLowerCase() }}
        </div>
      </div>

      <!-- Property and Tenant Info -->
      <div class="pt-2">
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">
          {{ getPropertyNameByLeaseId(request.leaseId, leases, properties) }}
        </h3>

        <div class="flex items-center mt-1 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ getTenantNameByLeaseId(request.leaseId, leases, tenants) }}
        </div>
      </div>

      <!-- Recently Updated Indicator -->
      <span v-if="isRecentlyUpdated(request.updatedAt)"
            class="absolute top-4 right-4 flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
    </div>

    <!-- Card Body -->
    <div class="px-6 py-4 flex-grow">
      <!-- Description -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
        <p class="text-sm text-gray-600 line-clamp-3">{{ request.description }}</p>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 class="text-xs font-medium text-gray-500 uppercase">Submitted</h4>
          <div class="flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm text-gray-700">{{ formatRelativeTime(request.createdAt) }}</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-medium text-gray-500 uppercase">Updated</h4>
          <div class="flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-gray-700">{{ formatRelativeTime(request.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Attachments -->
      <div v-if="request.imageUrls?.length" class="mt-4">
        <h4 class="flex items-center text-sm font-medium text-gray-700 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Attachments ({{ request.imageUrls.length }})
        </h4>

        <div class="grid grid-cols-3 gap-2">
          <button
              v-for="(imageId, index) in request.imageUrls"
              :key="index"
              @click="openSlider(index)"
              class="block w-full aspect-square rounded-md overflow-hidden border hover:shadow-md transition group relative">
            <img
                :src="`http://localhost:8080/image/${imageId}`"
                :alt="`Attachment ${index + 1}`"
                loading="lazy"
                class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <!-- Status Update -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label class="text-sm font-medium text-gray-700 flex-shrink-0">Status:</label>

        <template v-if="['COMPLETED', 'CANCELLED'].includes(request.status)">
          <span class="text-sm py-2 px-3 bg-gray-100 border border-gray-200 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Status locked
          </span>
        </template>

        <div v-else class="relative flex-1">
          <select
              :value="request.status"
              @change="emit('update-status', request.requestId, $event.target.value)"
              class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition appearance-none"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Cost Input (for completed requests) -->
      <div v-if="request.status === 'COMPLETED'" class="space-y-2">
        <label class="text-sm text-gray-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Maintenance Cost
        </label>

        <div v-if="!isCostSaved" class="flex gap-2 items-center">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">$</span>
            </div>
            <input
                v-model="cost"
                type="number"
                placeholder="Enter cost"
                class="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
              @click="saveCost"
              :disabled="isSaving"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>

        <div v-else class="flex items-center text-sm text-green-700 font-medium py-2 px-3 bg-green-50 border border-green-200 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cost recorded: {{ formatCurrency(request.cost) }}
        </div>

        <p v-if="saveError" class="text-red-500 text-xs mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ saveError }}
        </p>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center backdrop-blur-sm">
      <div class="bg-white rounded-xl overflow-hidden w-full max-w-5xl shadow-xl relative">
        <!-- Close Button -->
        <button @click="showModal = false"
                class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-red-600 transition-colors focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Counter -->
        <div class="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded-md text-sm">
          {{ activeIndex + 1 }} / {{ request.imageUrls.length }}
        </div>

        <!-- Swiper -->
        <Swiper :initialSlide="activeIndex" :slidesPerView="1" navigation pagination class="h-[90vh]">
          <SwiperSlide v-for="(imageId, index) in request.imageUrls" :key="index">
            <div class="w-full h-full flex items-center justify-center bg-gray-900 p-4">
              <img
                  :src="`http://localhost:8080/image/${imageId}`"
                  :alt="`Image ${index + 1}`"
                  class="max-w-full max-h-full object-contain"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>