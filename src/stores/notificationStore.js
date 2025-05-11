import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchNotificationsByEmail} from '@/services/notificationService'
import { jwtDecode } from 'jwt-decode'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([])
    const unreadCount = ref(0)
    const intervalId = ref(null)

    const fetchNotification = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const decoded = jwtDecode(token)
            const email = decoded?.userId || decoded?.id || decoded?.sub

            const response = await fetchNotificationsByEmail(email)
            notifications.value = response
            unreadCount.value = response.filter(n => !n.read).length
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    const startPolling = () => {
        if (!intervalId.value) {
            fetchNotification()
            intervalId.value = setInterval(fetchNotification, 30000)
        }
    }

    const stopPolling = () => {
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }

    return { notifications, unreadCount, fetchNotification, startPolling, stopPolling }
})
