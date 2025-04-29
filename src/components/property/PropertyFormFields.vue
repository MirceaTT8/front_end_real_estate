<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from 'vue'
import FileUploader from '@/components/property/PropertyFileUploader.vue'

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' }
]

const emit = defineEmits(['update:modelValue', 'update:attachments', 'location-selected'])

const props = defineProps({
  isLoading: Boolean,
  modelValue: {
    type: Object,
    required: true
  },
  attachments: {
    type: Array,
    required: true
  }
})

const form = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const attachments = computed({
  get() {
    return props.attachments
  },
  set(value) {
    emit('update:attachments', value)
  }
})

const autocompleteInput = ref(null)
const autocomplete = ref(null)

// Watch for Google Maps API to be available
const initAutocomplete = () => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.log('Google Maps API not ready yet')
    return false
  }

  autocomplete.value = new google.maps.places.Autocomplete(
      autocompleteInput.value,
      {
        types: ['address'],
        fields: ['address_components', 'geometry', 'formatted_address'],
        componentRestrictions: { country: 'ro' }
      }
  )

  autocomplete.value.addListener('place_changed', () => {
    const place = autocomplete.value.getPlace()
    if (!place.geometry) {
      console.log('No details available for input: ' + place.name)
      return
    }

    form.value.address = place.formatted_address
    emit('location-selected', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    })
  })

  return true
}

onMounted(() => {
  if (initAutocomplete()) return

  const checkInterval = setInterval(() => {
    if (initAutocomplete()) {
      clearInterval(checkInterval)
    }
  }, 200)
})

onUnmounted(() => {
  if (autocomplete.value) {
    google.maps.event.clearInstanceListeners(autocomplete.value)
  }
})
</script>

<template>
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
      <input
          ref="autocompleteInput"
          v-model="form.address"
          type="text"
          required
          class="w-full p-2 border rounded"
          :disabled="isLoading"
          placeholder="Start typing an address..."
          id="autocomplete"
      >
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

    <FileUploader
        v-model="attachments"
        :is-loading="isLoading"
    />
  </div>
</template>