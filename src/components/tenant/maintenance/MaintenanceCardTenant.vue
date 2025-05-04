<!-- MaintenanceCardTenant.vue -->
<template>
  <div class="bg-white shadow rounded-xl border border-gray-200 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
      <div>
        <h3 class="text-base font-semibold text-gray-800">Request #{{ request.requestId }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ request.type }}</p>
      </div>
      <span
          class="text-xs font-medium px-3 py-1 rounded-full w-fit sm:w-auto"
          :class="{
          'bg-orange-100 text-orange-700': request.status === 'PENDING',
          'bg-blue-100 text-blue-700': request.status === 'IN_PROGRESS',
          'bg-green-100 text-green-700': request.status === 'COMPLETED'
        }"
      >
        {{ statusDisplay[request.status]?.label || request.status }}
      </span>
    </div>

    <p class="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{{ request.description }}</p>

    <!-- Image Grid -->
    <div v-if="request.imageUrls?.length" class="mb-4">
      <h4 class="font-medium text-sm text-gray-700 mb-2">
        Attached Photos ({{ request.imageUrls.length }})
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

    <!-- Metadata -->
    <div class="text-xs text-gray-500 space-y-1">
      <div><span class="font-medium">Submitted:</span> {{ formatDate(request.createdAt) }}</div>
      <div><span class="font-medium">Last Updated:</span> {{ formatDate(request.updatedAt) }}</div>
      <div v-if="request.status === 'COMPLETED'">
        <span class="font-medium">Resolution Time:</span> {{ request.resolution_time }} days
      </div>
      <div v-if="request.status === 'COMPLETED'">
        <span class="font-medium">Fixed?:</span> {{ request.is_fixed ? 'Yes' : 'No' }}
      </div>
    </div>

    <!-- Modal for Image Slider -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex items-center justify-center">
      <div class="bg-white rounded-lg overflow-hidden w-full max-w-5xl shadow-lg relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10">&times;</button>
        <Swiper :initial-slide="activeIndex" :modules="[Navigation, Pagination]" navigation pagination class="h-[90vh]">
          <SwiperSlide v-for="(imageId, index) in request.imageUrls" :key="index">
            <img :src="`http://localhost:8080/image/${imageId}`" :alt="`Image ${index + 1}`" class="w-full h-full object-contain" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const showModal = ref(false);
const activeIndex = ref(0);

const openSlider = (index) => {
  activeIndex.value = index;
  showModal.value = true;
};

defineProps({
  request: {
    type: Object,
    required: true
  }
})

const statusDisplay = {
  PENDING: { label: 'Pending', color: 'orange' },
  IN_PROGRESS: { label: 'In Progress', color: 'blue' },
  COMPLETED: { label: 'Completed', color: 'green' }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
</style>
