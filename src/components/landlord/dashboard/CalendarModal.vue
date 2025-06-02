<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { ref } from 'vue'

const props = defineProps({
  calendarEvents: Array
})

const selectedEvent = ref(null)

const selectEvent = (event) => {
  selectedEvent.value = event;
}

const getEventColor = (eventClass) => {
  switch (eventClass) {
    case 'payment-event':
      return {
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        textColor: 'text-white',
        badgeColor: 'bg-blue-100 text-blue-700',
        ringColor: 'ring-blue-200'
      };
    case 'lease-event':
      return {
        bgColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        textColor: 'text-white',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        ringColor: 'ring-emerald-200'
      };
    case 'maintenance-event':
      return {
        bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
        textColor: 'text-white',
        badgeColor: 'bg-orange-100 text-orange-700',
        ringColor: 'ring-orange-200'
      };
    default:
      return {
        bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
        textColor: 'text-white',
        badgeColor: 'bg-gray-100 text-gray-700',
        ringColor: 'ring-gray-200'
      };
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

const getEventIcon = (eventClass) => {
  switch (eventClass) {
    case 'payment-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>';
    case 'lease-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
    case 'maintenance-event':
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-200/50">
      <!-- Modal Header -->
      <div class="px-8 py-6 border-b border-gray-100/80 flex justify-between items-center sticky top-0 bg-white z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Event Calendar</h2>
            <p class="text-sm text-gray-500">{{ calendarEvents?.length || 0 }} events scheduled</p>
          </div>
        </div>

        <button
            @click="$emit('close')"
            class="w-12 h-12 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Calendar Content -->
      <div class="flex flex-col xl:flex-row h-[calc(95vh-12rem)]">
        <!-- Calendar View -->
        <div class="xl:w-3/4 border-r border-gray-100/80 bg-gradient-to-br from-gray-50/50 to-white">
          <div class="p-6 h-full">
            <VueCal
                :events="calendarEvents"
                :time="false"
                default-view="month"
                @event-focus="selectEvent"
                :hide-weekends="false"
                style="height: 100%; min-height: 500px;"
                :event-content="
                ({ event }) => `
                  <div class='vuecal__event-title text-white font-medium text-xs px-1 py-0.5 rounded'>
                    ${event.title}
                  </div>
                `
              "
                :events-on-month-view="'short'"
                :on-event-click="selectEvent"
                class="vuecal--modern-theme rounded-xl overflow-hidden shadow-sm border border-gray-200/50"
            />
          </div>
        </div>

        <!-- Event Details Sidebar -->
        <div class="xl:w-1/4 border-t xl:border-t-0 border-gray-100/80 bg-gradient-to-b from-gray-50/30 to-white">
          <div v-if="selectedEvent" class="p-8 h-full overflow-y-auto">
            <div class="mb-8">
              <div class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold mb-4 shadow-sm ring-1"
                   :class="getEventColor(selectedEvent.class).badgeColor + ' ' + getEventColor(selectedEvent.class).ringColor">
                <span v-html="getEventIcon(selectedEvent.class)" class="mr-2"></span>
                {{ selectedEvent.title }}
              </div>
              <p class="text-gray-700 leading-relaxed">{{ selectedEvent.description || 'No additional details provided' }}</p>
            </div>

            <div class="space-y-6">
              <div class="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</h4>
                </div>
                <p class="text-gray-900 font-semibold">{{ formatDate(selectedEvent.start) }}</p>
              </div>

              <div v-if="selectedEvent.time !== false" class="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</h4>
                </div>
                <p class="text-gray-900 font-semibold">{{ formatTime(selectedEvent.start) }}</p>
              </div>

              <div v-if="selectedEvent.location" class="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</h4>
                </div>
                <p class="text-gray-900 font-semibold">{{ selectedEvent.location }}</p>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Select an Event</h3>
            <p class="text-gray-500 text-sm max-w-sm">Click on any event in the calendar to view its details and information.</p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-8 py-4 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-white flex justify-end">
        <button
            @click="$emit('close')"
            class="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm"
        >
          Close Calendar
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom VueCal styling with modern theme */
.vuecal--modern-theme {
  font-family: inherit;
  border: none;
}

.vuecal--modern-theme .vuecal__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.75rem 0.75rem 0 0;
}

.vuecal--modern-theme .vuecal__title {
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.vuecal--modern-theme .vuecal__arrow {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: all 0.2s;
}

.vuecal--modern-theme .vuecal__arrow:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.vuecal--modern-theme .vuecal__weekdays-headings {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.vuecal--modern-theme .vuecal__weekday-label {
  padding: 1rem 0.5rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.vuecal--modern-theme .vuecal__cell {
  border: 1px solid #f1f5f9;
  background: white;
  transition: all 0.2s;
}

.vuecal--modern-theme .vuecal__cell:hover {
  background: #f8fafc;
}

.vuecal--modern-theme .vuecal__cell.today {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.vuecal--modern-theme .vuecal__cell-content {
  padding: 0.75rem 0.5rem;
  min-height: 5rem;
}

.vuecal--modern-theme .vuecal__cell-date {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.vuecal--modern-theme .vuecal__cell.today .vuecal__cell-date {
  color: #1d4ed8;
  font-weight: 700;
}

.vuecal--modern-theme .vuecal__event {
  color: white !important;
  font-size: 0.75rem;
  margin: 0.125rem 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.vuecal--modern-theme .vuecal__event:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.vuecal--modern-theme .vuecal__event.payment-event {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.vuecal--modern-theme .vuecal__event.lease-event {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.vuecal--modern-theme .vuecal__event.maintenance-event {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}

.vuecal--modern-theme .vuecal__event.default-event {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

/* Animation classes */
.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation: fadeIn 0.2s ease-out;
}

.zoom-in-95 {
  animation: zoomIn95 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom scrollbar for sidebar */
.xl\:w-1\/4 {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.xl\:w-1\/4::-webkit-scrollbar {
  width: 6px;
}

.xl\:w-1\/4::-webkit-scrollbar-track {
  background: transparent;
}

.xl\:w-1\/4::-webkit-scrollbar-thumb {
  background-color: rgb(203 213 225);
  border-radius: 3px;
}

.xl\:w-1\/4::-webkit-scrollbar-thumb:hover {
  background-color: rgb(148 163 184);
}
</style>