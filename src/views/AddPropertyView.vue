<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  owner_id: '',
  name: '',
  address: '',
  type: 'apartment',
  rent_amount: '',
  status: 'available'
})

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' }
]

const submitForm = async () => {
  try {
    console.log('Property submitted:', form.value)
    router.push('/properties')
  } catch (error) {
    console.error('Error adding property:', error)
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-bold mb-6">Add New Property</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block mb-1">Property Name *</label>
        <input
            v-model="form.name"
            type="text"
            required
            class="w-full p-2 border rounded"
        >
      </div>

      <div>
        <label class="block mb-1">Address *</label>
        <textarea
            v-model="form.address"
            required
            class="w-full p-2 border rounded"
            rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1">Property Type *</label>
        <select
            v-model="form.type"
            class="w-full p-2 border rounded"
        >
          <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1">Monthly Rent ($) *</label>
        <input
            v-model.number="form.rent_amount"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full p-2 border rounded"
        >
      </div>

      <div>
        <label class="block mb-1">Status</label>
        <select
            v-model="form.status"
            class="w-full p-2 border rounded"
        >
          <option value="available">Available</option>
          <option value="rented">Rented</option>
        </select>
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <button
            type="button"
            @click="router.push('/properties')"
            class="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Property
        </button>
      </div>
    </form>
  </div>
</template>