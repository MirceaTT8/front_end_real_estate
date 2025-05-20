<script setup>
const props = defineProps({
  activities: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

// Get appropriate icon based on activity type
const getActivityIcon = (activity) => {
  // Use emoji from the activity data if available
  if (activity.icon) return activity.icon;

  // Otherwise determine icon based on description
  const description = activity.description.toLowerCase();

  if (description.includes('payment') || description.includes('paid')) {
    return '💰';
  } else if (description.includes('maintenance') || description.includes('repair')) {
    return '🔧';
  } else if (description.includes('lease') || description.includes('signed')) {
    return '📄';
  } else if (description.includes('message') || description.includes('contacted')) {
    return '✉️';
  } else {
    return '📌';
  }
}

// Group activities by date
const groupActivitiesByDate = () => {
  const groups = {};
  props.activities.forEach(activity => {
    // In a real app, parse the actual date from activity.time
    // For this example, assume activity.time already has the date info we need
    const date = activity.time.split(' ')[0]; // Very simplified, would need proper date parsing
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
  });
  return groups;
}

// Get avatar initial from name if present in description
const getInitial = (description) => {
  const nameMatch = description.match(/\b([A-Z][a-z]+)\b/); // Match capitalized words
  return nameMatch ? nameMatch[1].charAt(0) : '?';
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">Activity History</h2>
        </div>

        <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content (Scrollable) -->
      <div class="overflow-y-auto p-6 max-h-[calc(90vh-4rem)]">
        <!-- Group Activities By Date -->
        <div v-for="(activities, date) in groupActivitiesByDate()" :key="date" class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 mb-4 sticky top-0">{{ date }}</h3>

          <div class="space-y-4">
            <div
                v-for="activity in activities"
                :key="activity.id"
                class="flex gap-4 items-start p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <!-- Activity Icon/Avatar -->
              <div v-if="activity.icon === '👤' || activity.icon === '👥'"
                   class="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {{ getInitial(activity.description) }}
              </div>
              <div v-else
                   class="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                   :class="{
                     'bg-green-100': getActivityIcon(activity) === '💰',
                     'bg-orange-100': getActivityIcon(activity) === '🔧',
                     'bg-purple-100': getActivityIcon(activity) === '📄',
                     'bg-blue-100': getActivityIcon(activity) === '✉️',
                     'bg-gray-100': getActivityIcon(activity) === '📌'
                   }">
                {{ getActivityIcon(activity) }}
              </div>

              <!-- Description and time -->
              <div class="flex-1 min-w-0">
                <p
                    class="font-medium text-gray-800 leading-snug"
                >
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- If No Activities -->
        <div v-if="activities.length === 0" class="flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p class="text-gray-500">No activity history found</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
            @click="emit('close')"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>