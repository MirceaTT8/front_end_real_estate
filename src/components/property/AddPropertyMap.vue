<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { GOOGLE_API_KEY } from '@/configs/config.js'

const props = defineProps({
  clickable: Boolean,
  draggable: Boolean,
  initialMarkers: Array
})

const emit = defineEmits(['map-click', 'marker-dragged'])

const map = ref(null)
const mapContainer = ref(null)
const currentMarker = ref(null)
const clickListener = ref(null)

const getMarkerIcon = () => ({
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: '#34D399',
  fillOpacity: 1,
  strokeColor: '#FFF',
  strokeWeight: 2,
  scale: 8
})

const clearAllMarkers = () => {
  if (currentMarker.value) {
    google.maps.event.clearInstanceListeners(currentMarker.value)
    currentMarker.value.setMap(null)
    currentMarker.value = null
  }
}

const addSingleMarker = (position) => {
  clearAllMarkers() // Always clear existing marker first

  if (!map.value) return

  currentMarker.value = new google.maps.Marker({
    position,
    map: map.value,
    icon: getMarkerIcon(),
    draggable: props.draggable
  })

  // Set up dragend listener if draggable
  if (props.draggable) {
    google.maps.event.addListener(currentMarker.value, 'dragend', (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
      emit('marker-dragged', newPosition)
    })
  }

  // Center and zoom map
  map.value.setCenter(position)
  map.value.setZoom(14)
}

const setupMapClickHandler = () => {
  if (!map.value || !props.clickable) return

  // Remove previous click listener if exists
  if (clickListener.value) {
    google.maps.event.removeListener(clickListener.value)
  }

  clickListener.value = map.value.addListener('click', (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    addSingleMarker(clickedLocation)
    emit('map-click', clickedLocation)
  })
}

const initMap = async () => {
  try {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    await loader.load()

    // Initialize map only if not already initialized
    if (!map.value) {
      map.value = new google.maps.Map(mapContainer.value, {
        center: { lat: 45.9432, lng: 24.9668 },
        zoom: 6,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      })
    }

    // Setup initial marker if provided
    if (props.initialMarkers?.length > 0) {
      addSingleMarker(props.initialMarkers[0])
    }

    setupMapClickHandler()
  } catch (err) {
    console.error('Map initialization error:', err)
  }
}

// Clean up all resources when component unmounts
onUnmounted(() => {
  if (clickListener.value) {
    google.maps.event.removeListener(clickListener.value)
  }
  clearAllMarkers()
  if (map.value) {
    google.maps.event.clearInstanceListeners(map.value)
  }
})

onMounted(() => {
  initMap()
})

watch(() => props.initialMarkers, (newMarkers) => {
  if (map.value && newMarkers?.length > 0) {
    addSingleMarker(newMarkers[0])
  }
}, { immediate: true })
</script>

<template>
  <div class="h-full bg-gray-100 rounded-lg overflow-hidden relative">
    <div
        ref="mapContainer"
        class="w-full h-full absolute top-0 left-0"
    ></div>
  </div>
</template>