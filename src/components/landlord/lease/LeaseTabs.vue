<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => tab.value && tab.label)
  },
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:activeTab']);

const setActiveTab = (tabValue) => {
  emit('update:activeTab', tabValue);
};

const tabColors = {
  ACTIVE: { active: 'text-green-600 border-b-2 border-green-600' },
  TERMINATED: { active: 'text-red-600 border-b-2 border-red-600' },
  all: { active: 'text-blue-600 border-b-2 border-blue-600' }
};
</script>

<template>
  <div class="flex border-b border-gray-200 mb-6">
    <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="setActiveTab(tab.value)"
        :class="[
        'px-4 py-2 font-medium text-gray-500 hover:text-gray-700 focus:outline-none',
        activeTab === tab.value ? tabColors[tab.value]?.active || 'text-blue-600 border-b-2 border-blue-600' : ''
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>