<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const props = defineProps({
  calendarEvents: Array
})
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">✕</button>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Calendar</h2>
      <VueCal
          :events="calendarEvents"
          :time="false"
          default-view="month"
          style="height: 600px"
      />
    </div>
  </div>
</template>

