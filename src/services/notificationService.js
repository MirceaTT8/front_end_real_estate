import { BASE_URL } from "@/configs/config.js";

const API = `${BASE_URL}/notification`;

export const fetchNotifications = async () => {
    try {
        const response = await fetch(`${API}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await fetch(`${API}/${notificationId}/read`, {
            method: 'PATCH'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};
