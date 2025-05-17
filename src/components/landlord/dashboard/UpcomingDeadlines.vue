<script setup>
const props = defineProps({
  calendarEvents: Array
})
</script>
<template>
  <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-700">Upcoming Deadlines</h2>
      <button class="text-sm text-blue-600 hover:underline" @click="$emit('view-calendar')">
        View Calendar
      </button>
    </div>
    <div class="space-y-3">
      <div
          v-for="(event, index) in calendarEvents.slice(0, 5)"
          :key="index"
          class="p-3 border-l-4 bg-blue-50 rounded-r-lg"
          :class="{
          'border-blue-500': event.class === 'payment-event',
          'border-green-500': event.class === 'lease-event',
          'border-red-500': event.class === 'maintenance-event'
        }"
      >
        <p class="font-medium">{{ event.title }}</p>
        <p class="text-sm text-gray-600">{{ new Date(event.start).toLocaleDateString() }}</p>
      </div>
    </div>
  </section>
</template>
