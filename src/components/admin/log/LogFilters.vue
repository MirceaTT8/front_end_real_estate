<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <slot name="filters" />
    </div>
    <div class="mt-4 flex justify-end">
      <button @click="$emit('reset')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2">
        Reset Filters
      </button>
      <button @click="$emit('apply')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Apply Filters
      </button>
    </div>
  </div>
</template>
