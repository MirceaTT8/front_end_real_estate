<script setup>
const props = defineProps({
  activities: Array
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">✕</button>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">All Activity</h2>
      <div class="space-y-4">
        <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="mt-1 text-xl text-gray-500">
            <span v-if="activity.type === 'payment'">💰</span>
            <span v-else-if="activity.type === 'maintenance'">🔧</span>
            <span v-else-if="activity.type === 'lease'">📋</span>
            <span v-else>✉️</span>
          </div>
          <div>
            <p class="font-medium">{{ activity.description }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

