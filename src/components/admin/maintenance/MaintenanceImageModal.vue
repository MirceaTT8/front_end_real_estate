<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
    <div class="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-600 hover:text-black text-lg">&times;</button>
      <h2 class="text-xl font-semibold mb-4">Maintenance Images</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <img
            v-for="(id, index) in images"
            :key="index"
            :src="`http://localhost:8080/image/${id}`"
            :alt="`Attachment ${index + 1}`"
            loading="lazy"
            class="rounded border shadow max-h-60 object-contain w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: Array,
  show: Boolean
})
defineEmits(['close'])
</script>
