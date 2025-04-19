<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addProperty } from '@/services/propertyService' // Import the method

const router = useRouter()
const form = ref({
  owner_id: 1,
  name: '',
  address: '',
  type: 'APARTMENT',
  rentAmount: '',
  status: 'AVAILABLE'
})

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' }
]

const isLoading = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const payload = {
      ...form.value,
      rent_amount: parseFloat(form.value.rent_amount)
    }

    await addProperty(payload)
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
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-bold mb-6">Add New Property</h1>

    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitForm" class="space-y-4">
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