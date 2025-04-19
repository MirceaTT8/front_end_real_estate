<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { fetchPropertiesByUserId } from '@/services/propertyService.js'
import {GOOGLE_API_KEY} from "@/configs/config.js";
import PropertyFilters from '@/components/PropertyFilters.vue'

const properties = ref([])
const loading = ref(true)
const error = ref(null)
const map = ref(null)
const mapContainer = ref(null)
const showMapView = ref(false)
const markers = ref([])

// Filter states
const filters = ref({
  location: '',
  type: '',
  status: ''
})

// Available filter options
const filterOptions = {
  types: ['Apartment', 'House', 'Commercial', 'Land'],
  statuses: ['Available', 'Occupied', 'Maintenance']
}

const initMap = async () => {
  try {
    await nextTick()

    if (!mapContainer.value) {
      throw new Error('Map container element not found')
    }

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
  } catch (err) {
    console.error('Map initialization error:', err)
    error.value = new Error('Failed to load map. Please try again later.')
  }
}

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesLocation = !filters.value.location ||
        property.address.toLowerCase().includes(filters.value.location.toLowerCase())

    const matchesType = !filters.value.type ||
        property.type.toLowerCase() === filters.value.type.toLowerCase()

    const matchesStatus = !filters.value.status ||
        property.status.toLowerCase() === filters.value.status.toLowerCase()

    return matchesLocation && matchesType && matchesStatus
  })
})

const resetFilters = () => {
  filters.value = {
    location: '',
    type: '',
    status: ''
  }
}

const onFiltersUpdate = (newFilters) => {
  filters.value = { ...newFilters }
}


onMounted(async () => {
  try {
    properties.value = await fetchPropertiesByUserId(1)
    // Initialize map only if map view is active

    if (properties.value.length > 0) {
      properties.value[0].latitude = 45.7489
      properties.value[0].longitude = 21.2087
    }
    if (properties.value.length > 1) {
      properties.value[1].latitude = 45.7589
      properties.value[1].longitude = 21.2187
    }

    console.log(properties.value)


    if (showMapView.value) {
      await initMap()
    }
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

const addMarkers = () => {
  // Clear existing markers first
  clearMarkers()

  if (!map.value || !properties.value.length) return

  const propsToMark = [...properties.value]

  // Create bounds to auto-zoom to show all markers
  const bounds = new google.maps.LatLngBounds()

  properties.value.forEach((property, index) => {

    const position = {
      lat: parseFloat(property.latitude),
      lng: parseFloat(property.longitude)
    }


    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: property.name,
      icon: getMarkerIcon(property.status) // Customize marker based on status
    })

    // Add info window
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

    marker.addListener('click', () => {
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
    bounds.extend(position)
  })

  // Auto-zoom to fit all markers
  if (markers.value.length > 0) {
    map.value.fitBounds(bounds)
    // Don't zoom too far out if only one marker
    if (markers.value.length === 1) {
      map.value.setZoom(14)
    }
  }
}

watch(showMapView, async (newVal) => {
  if (newVal && !map.value) {
    await initMap()
  } else if (newVal && map.value) {
    addMarkers()
  }
}, { flush: 'post' })

const clearMarkers = () => {
  markers.value.forEach(marker => {
    marker.setMap(null)
  })
  markers.value = []
}

const getMarkerIcon = (status) => {
  // Return different colored markers based on status
  const colorMap = {
    'AVAILABLE': '#34D399', // green
    'RENTED': '#FBBF24',  // amber
    'DISABLED': '#EF4444' // red
  }

  const color = colorMap[status.toLowerCase()] || '#3B82F6' // default blue

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFF',
    strokeWeight: 2,
    scale: 8
  }
}

</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-semibold text-gray-800 mb-8">My Properties</h1>

    <!-- View Toggle Buttons -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2 mb-4">
        <button
            @click="showMapView = false"
            :class="!showMapView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'"
            class="px-4 py-2 rounded-md transition-colors"
        >
          List View
        </button>
        <button
            @click="showMapView = true"
            :class="showMapView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'"
            class="px-4 py-2 rounded-md transition-colors"
        >
          Map View
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <PropertyFilters
        :filters="filters"
        :filterOptions="filterOptions"
        @update:filters="onFiltersUpdate"
    />
    <!-- Results Count -->
    <div class="flex justify-between items-center mb-4">
      <p class="text-sm text-gray-600">
        Showing {{ filteredProperties.length }} of {{ properties.length }} properties
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="text-gray-600">Loading your properties...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-700">
      <span class="text-xl">⚠️</span>
      <p>Error loading properties: {{ error.message }}</p>
    </div>

    <!-- Map View -->
    <div v-if="!loading && !error && showMapView" class="h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-8 relative">
      <div
          ref="mapContainer"
          class="w-full h-full absolute top-0 left-0"
      ></div>
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
        <div class="text-center p-4 bg-white rounded-lg shadow-md">
          <p class="text-red-500">{{ error.message }}</p>
          <button
              @click="initMap"
              class="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="!loading && !error && !showMapView">
      <div v-if="filteredProperties.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 class="text-xl text-gray-600 mb-2">No properties found</h3>
        <p class="text-gray-500">No properties match your current filters.</p>
        <button
            @click="resetFilters"
            class="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
        >
          Clear all filters
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="property in filteredProperties" :key="property.id" class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <div class="h-48 overflow-hidden">
            <img
                :src="property.image || '@/assets/property-placeholder.jpg'"
                alt="Property image"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            >
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ property.name }}</h3>
              <span
                  :class="{
                  'bg-green-50 text-green-800': property.status === 'AVAILABLE',
                  'bg-amber-50 text-amber-800': property.status === 'RENTED',
                  'bg-red-50 text-red-800': property.status === 'maintenance'
                }"
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              >
                {{ property.status }}
              </span>
            </div>
            <div class="flex justify-between mb-4">
              <p class="flex items-center text-gray-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ property.address }}
              </p>
              <p class="flex items-center text-green-700 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${{ property.monthlyRent }} <span class="text-gray-500 font-normal">/month</span>
              </p>
            </div>
            <p class="text-gray-600 text-sm line-clamp-3 mb-6">{{ property.description }}</p>
            <div class="flex justify-end">
              <button class="flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gm-style iframe {
  border-radius: 0.5rem;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>