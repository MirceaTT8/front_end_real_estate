<script setup>
const props = defineProps({
  activities: Array
})
</script>

<template>
  <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-700">Recent Activity</h2>
      <button v-if="activities.length > 5" @click="$emit('view-all')" class="text-sm text-blue-600 hover:underline">
        View All
      </button>
    </div>
    <div class="divide-y divide-gray-100">
      <div
          v-for="(activity, index) in activities.slice(0, 5)"
          :key="index"
          class="flex gap-3 items-start py-3 first:pt-0 last:pb-0"
      >
        <div class="mt-1 text-xl text-gray-500">
          <span v-if="activity.type === 'payment'">💰</span>
          <span v-else-if="activity.type === 'maintenance'">🔧</span>
          <span v-else-if="activity.type === 'lease'">📋</span>
          <span v-else>✉️</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800 line-clamp-1">{{ activity.description }}</p>
          <p class="text-sm text-gray-500">{{ activity.time }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
