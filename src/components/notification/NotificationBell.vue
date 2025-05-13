<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore.js';
import { storeToRefs } from 'pinia';
import { markNotificationAsRead } from '@/services/notificationService';
import { formatTimeAgo } from '@/utils/dateUtils';

const notificationStore = useNotificationStore();
const { unreadCount, notifications } = storeToRefs(notificationStore);
const showDropdown = ref(false);

onMounted(() => {
  notificationStore.fetchNotification();
});

const handleNotificationClick = async (notification) => {
  try {
    if (!notification.read) {
      await markNotificationAsRead(notification.notificationId);
      notification.read = true;
      notification.status = 'READ';
      unreadCount.value--;
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
</script>

<template>
  <div class="relative">
    <button @click="showDropdown = !showDropdown" class="p-2 relative">
      <i class="pi pi-bell text-white text-xl"></i>
      <span v-if="unreadCount > 0"
            class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
        {{ unreadCount }}
      </span>
    </button>

    <transition name="fade-slide">
      <div v-if="showDropdown"
           class="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 animate-fade-in">
        <div class="py-2 max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="px-4 py-3 text-gray-500 text-center">
            No new notifications
          </div>
          <div v-for="notification in sortedNotifications"
               :key="notification.notificationId"
               @click="handleNotificationClick(notification)"
               class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-none transition-all duration-200 ease-in-out"
               :class="{ 'bg-gray-50 text-gray-600': notification.read }">
            <div class="font-semibold text-gray-800">{{ notification.title }}</div>
            <div class="text-gray-500 text-sm mt-1">{{ notification.message }}</div>
            <div class="flex justify-between items-center text-xs text-gray-400 mt-2">
              <span>{{ formatTimeAgo(notification.createdAt) }}</span>
              <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 text-sm text-center bg-gray-50">
          <router-link to="/notifications" class="text-blue-600 hover:underline">
            View All Notifications
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
