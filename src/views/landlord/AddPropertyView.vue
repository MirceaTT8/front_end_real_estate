<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLandlordPropertyStore } from '@/stores/propertyStore.js'
import PropertyFormFields from "@/components/landlord/property/property-add/PropertyFormFields.vue";
import PropertyLocationMap from "@/components/landlord/property/property-add/PropertyLocationMap.vue";
const router = useRouter()
const propertyStore = useLandlordPropertyStore()

const form = ref({
  owner_id: 1,
  name: '',
  address: '',
  type: 'APARTMENT',
  rentAmount: '',
  status: 'AVAILABLE',
  longitude: null,
  latitude: null
})

const isLoading = ref(false)
const errorMessage = ref('')
const attachments = ref([])
const activeTab = ref('details') // For tab navigation: 'details' or 'location'
const windowWidth = ref(0) // Add reactive reference for window width

// Update window width on mount and resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Set up event listeners on component mount
onMounted(() => {
  updateWindowWidth() // Set initial value
  window.addEventListener('resize', updateWindowWidth)
})

// Clean up event listeners on component unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const handleMapClick = (location) => {
  form.value.longitude = location.lng
  form.value.latitude = location.lat
}

const handleLocationSelected = async (location) => {
  form.value.longitude = location.lng
  form.value.latitude = location.lat
  form.value.address = await reverseGeocode(location)
}

const handleMarkerDragged = async (location) => {
  form.value.longitude = location.lng
  form.value.latitude = location.lat
  form.value.address = await reverseGeocode(location)
}

const reverseGeocode = async (location) => {
  if (!window.google) return form.value.address

  const geocoder = new google.maps.Geocoder()
  return new Promise((resolve) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address)
      } else {
        resolve(form.value.address)
      }
    })
  })
}

function cancel() {
  router.push('/properties')
}

async function saveProperty() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    if (!form.value.longitude || !form.value.latitude) {
      errorMessage.value = 'Please select a location on the map'
      return
    }

    const payload = {
      ...form.value,
      rent_amount: parseFloat(form.value.rentAmount),
      longitude: parseFloat(form.value.longitude),
      latitude: parseFloat(form.value.latitude)
    }

    await propertyStore.addProperty(payload, attachments.value)
    await router.push('/landlord/properties')
  } catch (error) {
    errorMessage.value = 'Failed to add property. Please try again.'
    console.error('Error adding property:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pb-16">
    <!-- Header area with decorative elements -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-8">
      <div class="px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Add New Property</h1>
              <p class="text-blue-100 mt-1">Fill in the details below to list your property</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Main content -->
    <div class="max-w-6xl mx-auto px-6 py-8">
      <form @submit.prevent="saveProperty" class="relative">
        <!-- Error message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm animate-pulse">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>
        </div>

        <!-- Mobile/small screens: Tab navigation -->
        <div class="lg:hidden mb-6">
          <div class="flex rounded-lg bg-white shadow-sm p-1 border border-gray-200">
            <button
                type="button"
                @click="activeTab = 'details'"
                :class="[
                'flex-1 py-3 px-2 rounded-md text-sm font-medium transition',
                activeTab === 'details' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600'
              ]"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Details
              </span>
            </button>
            <button
                type="button"
                @click="activeTab = 'location'"
                :class="[
                'flex-1 py-3 px-2 rounded-md text-sm font-medium transition',
                activeTab === 'location' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600'
              ]"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Form Section (hidden on mobile if location tab is active) -->
          <div
              class="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300"
              :class="{'hidden': activeTab === 'location' && windowWidth < 1024}"
          >
            <div class="border-b border-gray-100 pb-4 mb-4">
              <h2 class="text-xl font-bold text-gray-800">Property Details</h2>
              <p class="text-gray-500 text-sm">Basic information about your property</p>
            </div>

            <PropertyFormFields
                v-model="form"
                v-model:attachments="attachments"
                :is-loading="isLoading"
                required
            />

            <div class="pt-4">
              <label class="block font-medium text-gray-700 mb-2">
                Property Images
                <span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 group cursor-pointer">
                <div class="mb-3 p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-700 group-hover:text-blue-700">Select or drag images here</p>
                <p class="text-sm text-gray-500 mt-1">Upload high-quality photos of your property</p>
                <input type="file" multiple required class="hidden" />
              </div>
              <div class="flex justify-between items-center mt-2">
                <p class="text-xs text-gray-500">Upload JPEG or PNG up to 5MB each</p>
                <span class="text-xs font-medium text-blue-600">0 files selected</span>
              </div>
            </div>
          </div>

          <!-- Map Section (hidden on mobile if details tab is active) -->
          <div
              class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit transition-all duration-300"
              :class="{'hidden': activeTab === 'details' && windowWidth < 1024}"
          >
            <div class="border-b border-gray-100 pb-4 mb-4">
              <h2 class="text-xl font-bold text-gray-800">Location</h2>
              <p class="text-gray-500 text-sm">Select the property's exact location</p>
            </div>

            <PropertyLocationMap
                v-model:longitude="form.longitude"
                v-model:latitude="form.latitude"
                :is-loading="isLoading"
                @map-click="handleMapClick"
                @marker-dragged="handleMarkerDragged"
                class="rounded-xl overflow-hidden border border-gray-200 shadow-inner"
                required
            />

            <div class="mt-4 flex items-start space-x-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-600">Click on the map or use the search box to select your property's location</p>
            </div>

            <div v-if="form.address" class="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p class="text-sm font-medium text-gray-700">Selected Address:</p>
              <p class="text-sm text-blue-700">{{ form.address }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-8 gap-4">
          <button
              type="button"
              @click="cancel"
              class="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium transition hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              :disabled="isLoading"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </span>
          </button>
          <button
              type="submit"
              class="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-lg transition hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isLoading"
          >
            <span class="flex items-center">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-if="isLoading">Saving Property...</span>
              <span v-else>Save Property</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>