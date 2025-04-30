<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ALL', label: 'All Requests' }
]
</script>

<template>
  <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-green-400"
  >
    <option
        v-for="option in statusOptions"
        :key="option.value"
        :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>