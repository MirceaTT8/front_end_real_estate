import {BASE_URL} from "@/configs/config.js";

const API = `${BASE_URL}/lease`;

export const fetchActiveLeasesByOwnerId = async (userId) => {
    try {
        const response = await fetch(`${API}/active/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

export const fetchLeaseId = async (leaseId) => {
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

export const createLease = async (leaseData) => {
    try {
        console.log(leaseData);
        const response = await fetch(`${API}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaseData)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Lease creation failed')
        }

        return await response.json()
    } catch (error) {
        console.error('Error creating lease:', error)
        throw error
    }
}