<script setup>
import { ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SwiperCore from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { setMaintenanceCost } from '@/services/maintenanceService.js'

SwiperCore.use([Navigation, Pagination])

const emit = defineEmits(['update-status'])

const { request } = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const statusDisplay = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-800', emoji: '⏳', border: 'border-amber-200' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-800', emoji: '🔧', border: 'border-blue-200' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-800', emoji: '✅', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-800', emoji: '❌', border: 'border-red-200' }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleString(undefined, options)
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

// New: Maintenance cost logic
const cost = ref(request.cost || '')
const isSaving = ref(false)
const saveError = ref(null)

const saveCost = async () => {
  if (!cost.value || isNaN(cost.value)) {
    saveError.value = 'Please enter a valid number'
    return
  }

  try {
    isSaving.value = true
    saveError.value = null
    await setMaintenanceCost(request.requestId, parseFloat(cost.value))
    // optionally emit an event or show confirmation
  } catch (err) {
    saveError.value = 'Failed to save cost'
    console.error(err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
    <div class="px-6 py-4 border-b relative" :class="statusDisplay[request.status].border">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Request</span>
          <h3 class="text-lg font-semibold text-gray-800">#{{ request.requestId }}</h3>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize"
              :class="[statusDisplay[request.status].bg, statusDisplay[request.status].text]">
          <span class="text-sm">{{ statusDisplay[request.status].emoji }}</span>
          {{ request.status.replace('_', ' ') }}
        </span>
      </div>
      <span v-if="isRecentlyUpdated(request.updatedAt)"
            class="absolute top-0 right-0 mt-2 mr-2 flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
    </div>

    <div class="px-6 py-4">
      <div class="grid grid-cols-[auto,1fr] gap-y-3 gap-x-4 text-sm">
        <span class="font-medium text-gray-500">Lease:</span>
        <span class="text-gray-800 font-mono">{{ request.leaseId }}</span>

        <span class="font-medium text-gray-500">Description:</span>
        <span class="text-gray-800 whitespace-pre-line">{{ request.description }}</span>

        <span class="font-medium text-gray-500">Submitted:</span>
        <span class="text-gray-800">{{ formatDate(request.createdAt) }}</span>

        <span class="font-medium text-gray-500">Last Updated:</span>
        <span class="text-gray-800">{{ formatDate(request.updatedAt) }}</span>
      </div>

      <div v-if="request.imageUrls?.length" class="mt-6">
        <h4 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
          📎 Attachments ({{ request.imageUrls.length }})
        </h4>

        <div class="grid grid-cols-3 gap-2">
          <button
              v-for="(imageId, index) in request.imageUrls"
              :key="index"
              @click="openSlider(index)"
              class="block w-full aspect-square rounded-lg overflow-hidden border hover:shadow-md transition"
          >
            <img
                :src="`http://localhost:8080/image/${imageId}`"
                :alt="`Attachment ${index + 1}`"
                loading="lazy"
                class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 py-4 bg-gray-50 border-t space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <label class="text-sm font-medium text-gray-700 flex-shrink-0">Update status:</label>
        <select
            :value="request.status"
            @change="emit('update-status', request.requestId, $event.target.value)"
            class="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
        >
          <option value="PENDING">⏳ Pending</option>
          <option value="IN_PROGRESS">🔧 In Progress</option>
          <option value="COMPLETED">✅ Completed</option>
          <option value="CANCELLED">❌ Cancelled</option>
        </select>
      </div>

      <div v-if="request.status === 'COMPLETED'" class="flex flex-col gap-2">
        <label class="text-sm text-gray-700 font-medium">Maintenance Cost</label>
        <input
            v-model="cost"
            type="number"
            placeholder="Enter cost"
            class="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            @click="saveCost"
            :disabled="isSaving"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
        >
          {{ isSaving ? 'Saving...' : 'Save Cost' }}
        </button>
        <p v-if="saveError" class="text-red-500 text-sm">{{ saveError }}</p>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg overflow-hidden w-full max-w-5xl shadow-lg relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10">&times;</button>
        <Swiper :initialSlide="activeIndex" :slidesPerView="1" navigation pagination class="h-[90vh]">
          <SwiperSlide v-for="(imageId, index) in request.imageUrls" :key="index">
            <img :src="`http://localhost:8080/image/${imageId}`" :alt="`Image ${index + 1}`" class="w-full h-full object-contain" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>
