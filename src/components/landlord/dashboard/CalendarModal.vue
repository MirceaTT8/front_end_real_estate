<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { ref } from 'vue'

const props = defineProps({
  calendarEvents: Array
})

// Track selected event
const selectedEvent = ref(null)

// Select an event to see details
const selectEvent = (event) => {
  selectedEvent.value = event;
}

// Get color classes based on event class
const getEventColor = (eventClass) => {
  switch (eventClass) {
    case 'payment-event':
      return {
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
      };
    case 'lease-event':
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-white'
      };
    case 'maintenance-event':
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white'
      };
    default:
      return {
        bgColor: 'bg-gray-500',
        textColor: 'text-white'
      };
  }
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format time for display
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get icon based on event class
const getEventIcon = (eventClass) => {
  switch (eventClass) {
    case 'payment-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>';
    case 'lease-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
    case 'maintenance-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">Calendar</h2>
        </div>

        <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Calendar Content -->
      <div class="flex flex-col lg:flex-row">
        <!-- Calendar View -->
        <div class="lg:w-3/4 border-r border-gray-100">
          <VueCal
              :events="calendarEvents"
              :time="false"
              default-view="month"
              @event-focus="selectEvent"
              hide-weekends
              style="height: 600px"
              :event-content="
              ({ event }) => `
                <div class='vuecal__event-title ${getEventColor(event.class).textColor}'>
                  ${event.title}
                </div>
              `
            "
              :events-on-month-view="'short'"
              :on-event-click="selectEvent"
              class="vuecal--blue-theme"
          />
        </div>

        <!-- Event Details Sidebar -->
        <div class="lg:w-1/4 border-t lg:border-t-0 border-gray-100">
          <div v-if="selectedEvent" class="p-6">
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
                   :class="getEventColor(selectedEvent.class).bgColor + ' ' + getEventColor(selectedEvent.class).textColor">
                <span v-html="getEventIcon(selectedEvent.class)" class="mr-1.5"></span>
                {{ selectedEvent.title }}
              </div>
              <p class="text-gray-700 text-sm">{{ selectedEvent.description || 'No additional details provided' }}</p>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</h4>
                <p class="text-gray-900 font-medium">{{ formatDate(selectedEvent.start) }}</p>
              </div>

              <div v-if="selectedEvent.time !== false">
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</h4>
                <p class="text-gray-900 font-medium">{{ formatTime(selectedEvent.start) }}</p>
              </div>

              <div v-if="selectedEvent.location">
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h4>
                <p class="text-gray-900 font-medium">{{ selectedEvent.location }}</p>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500 text-sm">Select an event to view details</p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
            @click="$emit('close')"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom VueCal styling */
.vuecal--blue-theme .vuecal__event {
  color: inherit;
  background-color: transparent;
  font-size: 0.8em;
}

.vuecal--blue-theme .vuecal__event.payment-event {
  background-color: rgba(59, 130, 246, 0.8);
  color: white;
}

.vuecal--blue-theme .vuecal__event.lease-event {
  background-color: rgba(16, 185, 129, 0.8);
  color: white;
}

.vuecal--blue-theme .vuecal__event.maintenance-event {
  background-color: rgba(239, 68, 68, 0.8);
  color: white;
}
</style>