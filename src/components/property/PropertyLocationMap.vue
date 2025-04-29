<script setup>
import AddPropertyMap from "@/components/property/AddPropertyMap.vue";

const props = defineProps({
  longitude: Number,
  latitude: Number,
  isLoading: Boolean
})

const emit = defineEmits(['update:longitude', 'update:latitude', 'map-click', 'marker-dragged'])

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
  <div>
    <label class="block mb-1">Select Location *</label>
    <div class="h-64 border rounded overflow-hidden">
      <AddPropertyMap
          :key="`map-${longitude}-${latitude}`"
          :clickable="true"
          :draggable="true"
          :initial-markers="longitude && latitude ? [{ lat: latitude, lng: longitude }] : []"
          @map-click="handleMapClick"
          @marker-dragged="handleMarkerDragged"
      />
    </div>
    <div v-if="longitude && latitude" class="mt-2 text-sm text-gray-600">
      Selected location: {{ latitude.toFixed(4) }}, {{ longitude.toFixed(4) }}
    </div>
    <div v-else class="mt-2 text-sm text-gray-600">
      Click on the map or enter an address to select a location
    </div>
  </div>
</template>