<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useMaintenanceTenantStore } from "@/stores/leaseMaintenanceTenantStore.js";

const showModal = ref(false);
const activeIndex = ref(0);
const isExpanded = ref(false);

const maintenanceStore = useMaintenanceTenantStore();

const openSlider = (index) => {
  activeIndex.value = index;
  showModal.value = true;
};

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
});

// Track if user has responded
const userFixedResponse = ref(props.request.is_fixed ?? null);
const hasSubmittedResponse = ref(props.request.is_fixed !== null);

const submitFixedStatus = async (isFixed) => {
  try {
    if (isFixed) {
      // For "Yes, it's fixed" - optionally call confirm endpoint
      // await maintenanceStore.confirmAsFixed(props.request.requestId);
      userFixedResponse.value = true;
      hasSubmittedResponse.value = true;
    } else {
      // For "No, still needs work" - call the store method
      await maintenanceStore.markAsNotFixed(props.request.requestId);

      userFixedResponse.value = false;
      hasSubmittedResponse.value = true;

      // Emit event to parent component
      emit('feedback-submitted', {
        requestId: props.request.requestId,
        isFixed: false
      });
    }
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    // Show error message to user
    alert('Failed to submit feedback. Please try again.');
  }
};

const emit = defineEmits(['feedback-submitted']);

// Status label/color mapping
const statusDisplay = {
  PENDING: {
    label: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    dotColor: 'bg-yellow-500',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
           </svg>`
  },
  COMPLETED: {
    label: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    dotColor: 'bg-green-500',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
           </svg>`
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getRequestTypeIcon = (type) => {
// Icons for different maintenance types
  switch (type?.toLowerCase() || '') {
    case 'plumbing':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
</svg>`;
    case 'electrical':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`;
    case 'hvac':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>`;
    case 'paint':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
</svg>`;
    case 'appliance':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
</svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
</svg>`
  }
}
</script>

<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
    <!-- Card Header -->
    <div class="px-6 py-5 border-b border-gray-100">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div class="flex items-center">
          <!-- Request Type Icon -->
          <div class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 mr-3">
            <span v-html="getRequestTypeIcon(request.type)"></span>
          </div>

          <div>
            <h3 class="text-base font-semibold text-gray-800">Request #{{ request.requestId }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ request.type }}</p>
          </div>
        </div>

        <!-- Status Badge -->
        <div
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            :class="`${statusDisplay[request.status]?.bgColor || 'bg-gray-100'} ${statusDisplay[request.status]?.textColor || 'text-gray-800'} border ${statusDisplay[request.status]?.borderColor || 'border-gray-200'}`"
        >
          <span
              :class="statusDisplay[request.status]?.dotColor || 'bg-gray-500'"
              class="h-1.5 w-1.5 rounded-full mr-1.5"
          ></span>
          {{ statusDisplay[request.status]?.label || request.status }}
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="px-6 py-4">
      <!-- Description (truncated if long) -->
      <div>
        <p
            class="text-sm text-gray-700 whitespace-pre-wrap mb-4"
            :class="{'line-clamp-3': !isExpanded && request.description.length > 200}"
        >
          {{ request.description }}
        </p>

        <button
            v-if="request.description.length > 200"
            @click="isExpanded = !isExpanded"
            class="text-xs text-teal-600 hover:text-teal-800 font-medium mb-4"
        >
          {{ isExpanded ? 'Show less' : 'Read more' }}
        </button>
      </div>

      <!-- Attached Photos -->
      <div v-if="request.imageUrls?.length" class="mb-4">
        <h4 class="font-medium text-sm text-gray-700 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Attached Photos ({{ request.imageUrls.length }})
        </h4>

        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <button
              v-for="(imageId, index) in request.imageUrls"
              :key="index"
              @click="openSlider(index)"
              class="block w-full aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all relative group"
          >
            <img
                :src="`http://localhost:8080/image/${imageId}`"
                :alt="`Attachment ${index + 1}`"
                loading="lazy"
                class="w-full h-full object-cover"
            />
            <!-- Zoom icon overlay on hover -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
              <div class="bg-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Meta Information -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
        <div class="space-y-2">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Submitted:</span>
            <span class="ml-1">{{ formatDate(request.createdAt) }}</span>
          </div>

          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">Last Updated:</span>
            <span class="ml-1">{{ formatDate(request.updatedAt) }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">Status:</span>
            <span class="ml-1">{{ statusDisplay[request.status]?.label || request.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Feedback Section -->
    <div v-if="request.status === 'COMPLETED'" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Was this maintenance issue resolved to your satisfaction?
      </h4>

      <!-- Initial Response Buttons -->
      <div v-if="!hasSubmittedResponse" class="flex gap-3 items-center">
        <button
            @click="submitFixedStatus(true)"
            class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Yes, it's fixed
        </button>
        <button
            @click="submitFixedStatus(false)"
            class="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          No, still needs work
        </button>
      </div>

      <!-- Response Confirmation -->
      <div v-if="hasSubmittedResponse" class="space-y-3">
        <!-- Positive Response -->
        <div v-if="userFixedResponse" class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-medium">✅ Issue Resolved Successfully</p>
            <p class="text-xs mt-1">Thank you for confirming the maintenance work was completed satisfactorily.</p>
          </div>
        </div>

        <!-- Negative Response -->
        <div v-else class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="flex-1">
              <p class="font-medium">⚠️ Marked as Not Fixed</p>
              <p class="text-xs mt-1">The request has been reopened. Your property manager will be notified and will contact you within 24 hours to address the remaining issues.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Slider Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl overflow-hidden w-full max-w-5xl shadow-xl relative">
        <div class="absolute top-4 right-4 z-10">
          <button @click="showModal = false" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Swiper
            :initial-slide="activeIndex"
            :modules="[Navigation, Pagination]"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="h-[80vh]"
        >
          <SwiperSlide v-for="(imageId, index) in request.imageUrls" :key="index">
            <div class="h-full w-full flex items-center justify-center bg-gray-900">
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