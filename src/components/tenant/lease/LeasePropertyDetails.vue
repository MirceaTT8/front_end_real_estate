<template>
  <div class="space-y-2 text-sm text-gray-700">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Property Details</h3>
    <div><span class="font-medium">Address:</span> {{ property.address }}</div>
    <div><span class="font-medium">Type:</span> {{ property.type }}</div>
    <div><span class="font-medium">Size:</span> {{ property.size }} sq ft</div>
  </div>
</template>

<script setup>
defineProps({ property: Object })
</script>
