
<script setup>
import { computed } from 'vue'
import PropertyAddMap from "@/components/landlord/property/property-add/PropertyAddMap.vue";

const props = defineProps({
  longitude: Number,
  latitude: Number,
  isLoading: Boolean
})

const emit = defineEmits(['update:longitude', 'update:latitude', 'map-click', 'marker-dragged'])

const initialMarkers = computed(() => {
  return props.longitude && props.latitude
      ? [{ lat: props.latitude, lng: props.longitude }]
      : []
})

const coordinatesText = computed(() => {
  if (props.longitude && props.latitude) {
    return `${props.latitude.toFixed(6)}, ${props.longitude.toFixed(6)}`
  }
  return null
})

const handleMapClick = (location) => {
  emit('update:longitude', location.lng)
  emit('update:latitude', location.lat)
  emit('map-click', location)
}

const handleMarkerDragged = (location) => {
  emit('update:longitude', location.lng)
  emit('update:latitude', location.lat)
  emit('marker-dragged', location)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Map Container -->
    <div class="relative">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Location on Map <span class="text-red-500">*</span>
      </label>

      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-sm text-gray-600">Loading map...</span>
        </div>
      </div>

      <!-- Map - Changed from h-80 to h-[600px] for much bigger map -->
      <div class="h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden shadow-inner bg-gray-50">
        <PropertyAddMap
            :key="`map-${longitude}-${latitude}`"
            :clickable="!isLoading"
            :draggable="!isLoading"
            :initial-markers="initialMarkers"
            @map-click="handleMapClick"
            @marker-dragged="handleMarkerDragged"
            class="w-full h-full"
        />
      </div>
    </div>

    <!-- Map Instructions -->
    <div class="flex items-start space-x-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p class="text-blue-700 font-medium">How to use:</p>
        <ul class="text-blue-600 mt-1 space-y-1">
          <li>• Click anywhere on the map to place a marker</li>
          <li>• Drag the marker to adjust the exact location</li>
          <li>• Use the address field above to search for a location</li>
        </ul>
      </div>
    </div>
    </div>
</template>
