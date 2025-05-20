<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Add New Property</h1>

    <form @submit.prevent="saveProperty">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow border">
          <PropertyFormFields v-model="form" v-model:attachments="attachments" :is-loading="isLoading" required />

          <div>
            <label class="block font-medium text-gray-700 mb-1">Property Images <span class="text-red-500">*</span></label>
            <div class="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center text-gray-500 text-sm hover:border-blue-400 transition">
              <i class="pi pi-images text-3xl mb-2"></i>
              <p>Select or drag images here</p>
              <input type="file" multiple required class="hidden" />
            </div>
            <p class="text-xs text-gray-400 mt-2">Upload JPEG or PNG up to 5MB each.</p>
          </div>
        </div>

        <!-- Map Section -->
        <div class="bg-white p-6 rounded-2xl shadow border h-fit">
          <PropertyLocationMap
              v-model:longitude="form.longitude"
              v-model:latitude="form.latitude"
              :is-loading="isLoading"
              @map-click="handleMapClick"
              @marker-dragged="handleMarkerDragged"
              required
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end mt-8 gap-4">
        <button
            type="button"
            @click="cancel"
            class="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            :disabled="isLoading"
        >
          Cancel
        </button>
        <button
            type="submit"
            class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow transition disabled:bg-blue-300"
            :disabled="isLoading"
        >
          <span v-if="isLoading">Saving...</span>
          <span v-else>Save Property</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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