<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore from 'swiper';
import {Navigation, Pagination} from "swiper/modules";

SwiperCore.use([Navigation, Pagination]);

defineProps({
  request: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-status']);

const statusDisplay = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-800', emoji: '⏳', border: 'border-amber-200' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-800', emoji: '🔧', border: 'border-blue-200' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-800', emoji: '✅', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-800', emoji: '❌', border: 'border-red-200' }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString(undefined, options);
};

const isRecentlyUpdated = (updatedAt) => {
  const updated = new Date(updatedAt);
  const now = new Date();
  return (now - updated) / (1000 * 60 * 60) < 24;
};

const showModal = ref(false);
const activeIndex = ref(0);

const openSlider = (index) => {
  activeIndex.value = index;
  showModal.value = true;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
    <!-- Header -->
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

    <!-- Details -->
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

      <!-- Image Previews -->
      <div v-if="request.imageUrls?.length" class="mt-6">
        <h4 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Attachments ({{ request.imageUrls.length }})
        </h4>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
              v-for="(imageId, index) in request.imageUrls"
              :key="index"
              @click="openSlider(index)"
              class="block w-full aspect-[4/3] rounded-lg overflow-hidden border hover:shadow-lg transition"
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

    <!-- Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t">
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
    </div>

    <!-- Modal for full image slider -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg overflow-hidden w-full max-w-2xl shadow-lg relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10">&times;</button>
        <Swiper :initialSlide="activeIndex" :slidesPerView="1" navigation pagination class="h-96">
          <SwiperSlide v-for="(imageId, index) in request.imageUrls" :key="index">
            <img :src="`http://localhost:8080/image/${imageId}`" :alt="`Image ${index + 1}`" class="w-full h-full object-contain" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>