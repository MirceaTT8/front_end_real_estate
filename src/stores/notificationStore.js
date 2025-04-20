// stores/notificationStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchNotifications } from '@/services/notificationService';

export const useNotificationStore = defineStore('notification', () => {
const notifications = ref([]);
const unreadCount = ref(0);

const fetchNotification = async () => {
    try {
        const response = await fetchNotifications(2);
        notifications.value = response;

        console.log(response);

        console.log(notifications.value);
        unreadCount.value = notifications.value.filter(n => n.read === false).length;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

    return { notifications, unreadCount, fetchNotification };
});