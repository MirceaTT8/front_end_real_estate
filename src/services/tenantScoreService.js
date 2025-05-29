import { BASE_URL } from "@/configs/config.js";

const API = `${BASE_URL}/tenant-score`;

export const fetchAllTenantScores = async () => {
    try {
        const response = await fetch(`${API}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tenant scores:', error);
        throw error;
    }
};

export const fetchTenantScore = async (tenantId) => {
    try {
        const response = await fetch(`${API}/${tenantId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching tenant score for ID ${tenantId}:`, error);
        throw error;
    }
};

export const fetchTenantPunctualityScore = async (tenantId) => {
    try {
        const response = await fetch(`${API}/punctuality/${tenantId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching tenant punctuality score for ID ${tenantId}:`, error);
        throw error;
    }
};

export const fetchTenantFeedbackScore = async (tenantId) => {
    try {
        const response = await fetch(`${API}/feedback/${tenantId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching tenant feedback score for ID ${tenantId}:`, error);
        throw error;
    }
};