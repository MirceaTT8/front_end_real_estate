<script setup>
defineProps({
  showCreateButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['create-new'])
</script>

<template>
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
    <button
        v-if="showCreateButton"
        @click="$emit('create-new')"
        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
    >
      + New Request
    </button>
  </header>
</template>