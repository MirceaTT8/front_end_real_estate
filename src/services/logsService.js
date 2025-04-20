import { BASE_URL } from "@/configs/config.js";

const API = `${BASE_URL}/activity-log`;

export const fetchAllLogs = async () => {
    try {
        const response = await fetch(`${API}/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};
