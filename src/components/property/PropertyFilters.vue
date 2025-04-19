<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['filters', 'filterOptions'])
const emit = defineEmits(['update:filters', 'reset'])

const internalFilters = ref({ ...props.filters })

watch(() => props.filters, (newFilters) => {
  if (JSON.stringify(internalFilters.value) !== JSON.stringify(newFilters)) {
    internalFilters.value = { ...newFilters }
  }
}, { deep: true })

watch(
    () => ({ ...internalFilters.value }),
    (newVal, oldVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        emit('update:filters', { ...newVal })
      }
    },
    { deep: true }
)
const reset = () => {
  internalFilters.value = {
    location: '',
    type: '',
    status: ''
  }
  emit('reset')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
    <div class="flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
            v-model="internalFilters.location"
            type="text"
            placeholder="Search by address"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
            v-model="internalFilters.type"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option v-for="type in filterOptions.types" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
            v-model="internalFilters.status"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option v-for="status in filterOptions.statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <button
          @click="reset"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>
