<script setup>
defineProps({
  lease: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Important Notes</h2>
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800">
      <p class="mb-2">{{ lease.specialTerms }}</p>
      <p>Please contact property management for any questions about your lease.</p>
    </div>
  </section>
</template>