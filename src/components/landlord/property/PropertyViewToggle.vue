<script setup>
const props = defineProps({
  showMap: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:showMap'])
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex gap-2 mb-4">
      <button
          @click="emit('update:showMap', false)"
          :class="!showMap ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'"
          class="px-4 py-2 rounded-md transition-colors"
      >
        List View
      </button>
      <button
          @click="emit('update:showMap', true)"
          :class="showMap ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'"
          class="px-4 py-2 rounded-md transition-colors"
      >
        Map View
      </button>
    </div>
  </div>
</template>