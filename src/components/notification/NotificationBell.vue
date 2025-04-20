<script setup>
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore.js';
import { storeToRefs } from 'pinia';
import { markNotificationAsRead } from '@/services/notificationService';

const notificationStore = useNotificationStore();
const { unreadCount, notifications } = storeToRefs(notificationStore);
const showDropdown = ref(false);

onMounted(() => {
  notificationStore.fetchNotification();
});

const handleNotificationClick = async (notification) => {
  try {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.notificationId);
      notification.isRead = true;
      notification.status = 'READ';
      unreadCount.value--;
    }

  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};
</script>

<template>
  <div class="relative">
    <button @click="showDropdown = !showDropdown" class="p-2 relative">
      <i class="pi pi-bell text-white" style="font-size: 1.25rem"></i>
      <span v-if="unreadCount > 0"
            class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
        {{ unreadCount }}
      </span>
    </button>

    <div v-if="showDropdown"
         class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
      <div class="py-1 max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="px-4 py-2 text-sm text-gray-700">
          No new notifications
        </div>
        <div v-for="notification in notifications"
             :key="notification.notificationId"
             @click="handleNotificationClick(notification)"
             class="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b"
             :class="{ 'bg-gray-50': notification.read }">
          <div class="font-medium">{{ notification.title }}</div>
          <div class="text-gray-500">{{ notification.message }}</div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-400">{{ notification.createdAt }}</span>
            <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
      </div>
      <div class="px-4 py-2 text-sm text-center bg-gray-50">
        <router-link to="/notifications" class="text-blue-500 hover:underline">
          View All Notifications
        </router-link>
      </div>
    </div>
  </div>
</template>