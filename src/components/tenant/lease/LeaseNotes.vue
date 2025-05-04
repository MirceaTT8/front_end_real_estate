
<script setup>
defineProps({ lease: Object })
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ lease.notes || 'No additional notes.' }}</p>
  </div>
</template>

