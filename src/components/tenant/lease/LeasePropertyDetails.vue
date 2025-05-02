<script setup>
defineProps({
  property: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Property Details</h2>
    <div class="bg-white shadow rounded p-6">
      <h3 class="text-lg font-bold text-gray-800">{{ property.name }}</h3>
      <p class="text-gray-600">{{ property.address }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
        <div><span class="font-semibold">Type:</span> {{ property.type }}</div>
      </div>
    </div>
  </section>
</template>