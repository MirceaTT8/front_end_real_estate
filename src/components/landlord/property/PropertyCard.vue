<script setup>
import { computed } from 'vue'
import PropertyAddMap from "@/components/landlord/property/property-add/PropertyAddMap.vue"

/**
 * Component for selecting and displaying a property location on a map
 */
const props = defineProps({
  longitude: {
    type: Number,
    default: null
  },
  latitude: {
    type: Number,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:longitude',
  'update:latitude',
  'map-click',
  'marker-dragged'
])

/**
 * Compute whether a location has been selected
 */
const hasLocation = computed(() =>
    props.longitude !== null &&
    props.latitude !== null &&
    !isNaN(props.longitude) &&
    !isNaN(props.latitude)
)

/**
 * Compute initial markers for the map based on current coordinates
 */
const initialMarkers = computed(() =>
    hasLocation.value ? [{ lat: props.latitude, lng: props.longitude }] : []
)

/**
 * Format coordinates for display with better precision control
 */
const formattedCoordinates = computed(() => {
  if (!hasLocation.value) return null

  return {
    lat: props.latitude.toFixed(6),
    lng: props.longitude.toFixed(6)
  }
})

/**
 * Handle map click event
 * @param {Object} location - Location object with lat/lng
 */
const handleMapClick = (location) => {
  if (props.isLoading) return

  emit('update:longitude', location.lng)
  emit('update:latitude', location.lat)
  emit('map-click', location)
}

/**
 * Handle marker drag event
 * @param {Object} location - Location object with lat/lng
 */
const handleMarkerDragged = (location) => {
  if (props.isLoading) return

  emit('update:longitude', location.lng)
  emit('update:latitude', location.lat)
  emit('marker-dragged', location)
}
</script>

<template>
  <div class="property-location-selector">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Select Location <span class="text-red-500">*</span>
    </label>

    <!-- Map Container -->
    <div
        class="map-container h-80 border border-gray-300 rounded-lg overflow-hidden shadow-inner transition-all duration-300"
        :class="{ 'opacity-70': isLoading }"
    >
      <PropertyAddMap
          :key="`map-${longitude || 'empty'}-${latitude || 'empty'}`"
          :clickable="!isLoading"
          :draggable="!isLoading"
          :initial-markers="initialMarkers"
          @map-click="handleMapClick"
          @marker-dragged="handleMarkerDragged"
      />
    </div>

    <!-- Location Information -->
    <div class="mt-3">
      <div v-if="hasLocation" class="flex items-center gap-3">
        <div class="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {{ formattedCoordinates.lat }}, {{ formattedCoordinates.lng }}
          </span>
        </div>
        <button
            v-if="!isLoading"
            @click="$emit('update:latitude', null); $emit('update:longitude', null);"
            class="text-red-600 text-sm hover:text-red-800 transition-colors"
            type="button"
        >
          Clear location
        </button>
      </div>
      <div v-else class="flex items-center text-sm text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Click on the map or enter an address to select a location
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-location-selector {
  @apply transition duration-200;
}

.map-container {
  @apply bg-gray-50;
  min-height: 320px;
}

.map-container:hover {
  @apply border-blue-300 shadow-md;
}

/* Add a subtle pulse animation when no location is selected */
@keyframes subtle-pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.map-container:not(:has(.marker)) {
  animation: subtle-pulse 2s infinite;
}
</style>