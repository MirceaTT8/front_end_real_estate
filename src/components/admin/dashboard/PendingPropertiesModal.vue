<template>
  <Dialog :visible="visible" modal header="Pending Properties" class="w-full max-w-2xl rounded-xl shadow-lg" @update:visible="$emit('update:visible', $event)">
    <div v-if="loading" class="text-center py-6 text-gray-500">Loading properties...</div>

    <div v-else-if="properties.length > 0" class="space-y-4">
      <div v-for="property in properties" :key="property.id" class="p-4 border rounded bg-blue-50">
        <p class="font-semibold text-blue-900">Property: {{ property.name || property.address }}</p>
        <p class="text-sm text-gray-600">Owner ID: {{ property.ownerId }}</p>
        <p class="text-sm text-gray-600">Status: {{ property.status }}</p>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 py-8">
      <p>No pending properties found.</p>
    </div>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  properties: Array,
  loading: Boolean
})

defineEmits(['update:visible'])
</script>
