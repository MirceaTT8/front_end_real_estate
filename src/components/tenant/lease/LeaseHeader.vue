<script setup>
defineProps({
  lease: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="flex items-center justify-between border-b pb-4">
    <h1 class="text-2xl font-bold text-gray-800">Your Lease Agreement</h1>
    <span
        :class="{
        'bg-green-100 text-green-700': lease.status === 'ACTIVE',
        'bg-red-100 text-red-600': lease.status === 'TERMINATED'
      }"
        class="px-4 py-1 rounded-full text-sm font-medium capitalize"
    >
      {{ lease.status }}
    </span>
  </div>
</template>