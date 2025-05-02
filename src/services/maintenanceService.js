import {BASE_URL} from "@/configs/config.js";
const API = `${BASE_URL}/maintenance`;

export const fetchMaintenanceRequestsByLease = async (leaseId) => {
    try {
        const response = await fetch(`${API}/lease/${leaseId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
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
        const response = await fetch(`${API}/owner/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        throw error;
    }
};

export const setStatus = async (requestId, status) => {
    try {
        const response = await fetch(`${API}/${requestId}/status?status=${status}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            throw new Error(`Failed to update status. HTTP status: ${response.status}`);
        }

        return await response.json(); // return updated request if your backend returns it
    } catch (error) {
        console.error('Error setting status:', error);
        throw error;
    }
};

export const addMaintenanceRequest = async (leaseId, requestData) => {
    try {
        const formData = new FormData();

        const jsonBlob = new Blob(
            [JSON.stringify({ description: requestData.description })],
            { type: 'application/json' }
        );

        console.log(requestData)

        formData.append('requestDTO', jsonBlob);
        if (requestData.attachments?.length) {
            requestData.attachments.forEach(attachment => {
                formData.append('images', attachment.file);
            });
        }

        const response = await fetch(`${API}/lease/${leaseId}`, {
            method: 'POST',
            body: formData
        });


        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error adding maintenance request:', error);
        throw error;
    }
};
