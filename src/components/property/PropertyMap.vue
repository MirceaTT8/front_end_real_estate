<script setup>
import { ref, onMounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { GOOGLE_API_KEY } from '@/configs/config.js'

const props = defineProps({
  properties: {
    type: Array,
    required: true
  },
  showMap: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['map-loaded', 'map-error'])

const map = ref(null)
const mapContainer = ref(null)
const markers = ref([])

const getMarkerIcon = (status) => {
  const colorMap = {
    'AVAILABLE': '#34D399',
    'RENTED': '#FBBF24',
    'DISABLED': '#EF4444'
  }

  const color = colorMap[status] || '#3B82F6'

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFF',
    strokeWeight: 2,
    scale: 8
  }
}

const clearMarkers = () => {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
}

const addMarkers = () => {
  clearMarkers()

  if (!map.value || !props.properties.length) return

  const bounds = new google.maps.LatLngBounds()

  props.properties.forEach(property => {
    const position = {
      lat: parseFloat(property.latitude),
      lng: parseFloat(property.longitude)
    }

    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: property.name,
      icon: getMarkerIcon(property.status)
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-bold">${property.name}</h3>
          <p>${property.address}</p>
          <p class="text-green-600 font-semibold">$${property.monthlyRent}/month</p>
          <a href="/properties/${property.id}" class="text-blue-500 hover:underline">View details</a>
        </div>
      `
    })

    marker.addListener('click', () => infoWindow.open(map.value, marker))
    markers.value.push(marker)
    bounds.extend(position)
  })

  if (markers.value.length > 0) {
    map.value.fitBounds(bounds)
    if (markers.value.length === 1) {
      map.value.setZoom(14)
    }
  }
}

const initMap = async () => {
  try {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    await loader.load()

    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: 45.7489, lng: 21.2087 },
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'cooperative'
    })

    addMarkers()
    emit('map-loaded')
  } catch (err) {
    console.error('Map initialization error:', err)
    emit('map-error', err)
  }
}

watch(() => props.showMap, async (show) => {
  if (show && !map.value) {
    await initMap()
  } else if (show && map.value) {
    addMarkers()
  }
}, { immediate: true })

watch(() => props.properties, () => {
  if (map.value) {
    addMarkers()
  }
}, { deep: true })
</script>

<template>
  <div class="h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-8 relative">
    <div
        ref="mapContainer"
        class="w-full h-full absolute top-0 left-0"
    ></div>
  </div>
</template>