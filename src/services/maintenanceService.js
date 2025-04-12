import {BASE_URL} from "@/configs/config.js";
const API = `${BASE_URL}/maintenance`;

export const fetchMaintenanceRequestsByLease = async (leaseId) => {
    try {
        const response = await fetch(`${API}/${leaseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        throw error;
    }
};

export const fetchMaintenanceRequestsByOwner = async (userId) => {
    try {
        const response = await fetch(`${API}/owner/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        throw error;
    }
};

export const addMaintenanceRequest = async (leaseId, requestDTO) => {
    try {
        const response = await fetch(`${API}/${leaseId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestDTO)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding maintenance request:', error);
        throw error;
    }
};
