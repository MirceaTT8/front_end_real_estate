<!-- AddPropertyForm.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addProperty } from '@/services/propertyService.js'
import AddPropertyMap from "@/components/property/AddPropertyMap.vue";

const router = useRouter()
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

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' }
]

const isLoading = ref(false)
const errorMessage = ref('')
const attachments = ref([])
const fileInput = ref(null)

const handleMapClick = (location) => {
  form.value.longitude = location.lng
  form.value.latitude = location.lat
}

const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    attachments.value.push({
      file: files[i],
      id: Date.now() + i, // Unique ID for each file
      name: files[i].name,
      size: files[i].size,
      preview: files[i].type.startsWith('image/') ? URL.createObjectURL(files[i]) : null
    })
  }

  event.target.value = ''
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const submitForm = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Validate required fields including location
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

    await addProperty(payload, attachments.value)
    await router.push('/properties')
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
        <div class="space-y-4">
          <div>
            <label class="block mb-1">Property Name *</label>
            <input
                v-model="form.name"
                type="text"
                required
                class="w-full p-2 border rounded"
                :disabled="isLoading"
            >
          </div>

          <div>
            <label class="block mb-1">Address *</label>
            <textarea
                v-model="form.address"
                required
                class="w-full p-2 border rounded"
                rows="3"
                :disabled="isLoading"
            ></textarea>
          </div>

          <div>
            <label class="block mb-1">Property Type *</label>
            <select
                v-model="form.type"
                class="w-full p-2 border rounded"
                :disabled="isLoading"
                required
            >
              <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Monthly Rent ($) *</label>
            <input
                v-model.number="form.rentAmount"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full p-2 border rounded"
                :disabled="isLoading"
            >
          </div>

          <!-- File Upload Section -->
          <div>
            <label class="block mb-1">Property Images</label>
            <div class="border-2 border-dashed rounded-lg p-4">
              <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
              >
              <button
                  type="button"
                  @click="fileInput.click()"
                  class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded transition"
                  :disabled="isLoading"
              >
                Select Images
              </button>
              <p class="mt-2 text-sm text-gray-500">
                Upload property photos (JPEG, PNG)
              </p>
            </div>

            <!-- Preview of selected files -->
            <div v-if="attachments.length > 0" class="mt-4 space-y-2">
              <div v-for="(attachment, index) in attachments" :key="attachment.id" class="flex items-center p-2 border rounded">
                <div v-if="attachment.preview" class="w-12 h-12 mr-3">
                  <img :src="attachment.preview" class="w-full h-full object-cover rounded" alt="Preview">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ attachment.name }}</p>
                  <p class="text-xs text-gray-500">{{ (attachment.size / 1024).toFixed(2) }} KB</p>
                </div>
                <button
                    type="button"
                    @click="removeAttachment(index)"
                    class="ml-2 p-1 text-red-500 hover:text-red-700"
                    :disabled="isLoading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block mb-1">Select Location *</label>
          <div class="h-64 border rounded overflow-hidden">
            <AddPropertyMap
                :clickable="true"
                :initial-markers="form.longitude && form.latitude ? [{ lat: form.latitude, lng: form.longitude }] : []"
                @map-click="handleMapClick"
            />
          </div>
          <div v-if="form.longitude && form.latitude" class="mt-2 text-sm text-gray-600">
            Selected location: {{ form.latitude.toFixed(4) }}, {{ form.longitude.toFixed(4) }}
          </div>
          <div v-else class="mt-2 text-sm text-gray-600">
            Click on the map to select a location
          </div>
        </div>
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