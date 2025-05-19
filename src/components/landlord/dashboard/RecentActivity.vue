<script setup>
const props = defineProps({
  activities: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view-all'])
</script>

<template>
  <section class="col-span-full md:col-span-4 bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-700">Recent Activity</h2>
      <button
          v-if="activities.length > 5"
          @click="emit('view-all')"
          class="text-sm text-blue-600 hover:underline"
      >
        View All
      </button>
    </div>

    <div class="divide-y divide-gray-100">
      <div
          v-for="(activity, index) in activities.slice(0, 5)"
          :key="activity.id"
          class="flex gap-4 items-start py-3 px-2 hover:bg-gray-50 rounded-lg transition"
      >
        <!-- Icon -->
        <div class="text-2xl mt-0.5 text-gray-600">
          {{ activity.icon }}
        </div>

        <!-- Description and time -->
        <div class="flex-1 min-w-0">
          <p
              class="font-medium text-gray-800 truncate"
              :title="activity.description"
          >
            {{ activity.description }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ activity.time }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
