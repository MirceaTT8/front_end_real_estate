<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLandlordPropertyStore } from '@/stores/propertyStore.js'
import PropertyFormFields from '@/components/landlord/property/property-add/PropertyFormFields.vue'
import PropertyLocationMap from '@/components/landlord/property/property-add/PropertyLocationMap.vue'

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

const submitForm = async () => {
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
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-xl font-bold mb-6">Add New Property</h1>

    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyFormFields
            v-model="form"
            v-model:attachments="attachments"
            :is-loading="isLoading"
            @location-selected="handleLocationSelected"
        />

        <PropertyLocationMap
            v-model:longitude="form.longitude"
            v-model:latitude="form.latitude"
            :is-loading="isLoading"
            @map-click="handleMapClick"
            @marker-dragged="handleMarkerDragged"
        />
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <button
            type="button"
            @click="router.push('/properties')"
            class="px-4 py-2 border rounded"
            :disabled="isLoading"
        >
          Cancel
        </button>
        <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            :disabled="isLoading"
        >
          <span v-if="isLoading">Saving...</span>
          <span v-else>Save Property</span>
        </button>
      </div>
    </form>
  </div>
</template>
