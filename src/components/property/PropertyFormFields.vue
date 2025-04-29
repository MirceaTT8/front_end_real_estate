<script setup>
import { ref } from 'vue'
import FileUploader from '@/components/property/PropertyFileUploader.vue'
import {computed} from "vue";
const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' }
]
//
// defineProps({
//   isLoading: Boolean
// })

const emit = defineEmits(['update:modelValue', 'update:attachments'])

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

    <FileUploader
        v-model="attachments"
        :is-loading="isLoading"
    />
  </div>
</template>