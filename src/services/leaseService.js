import {BASE_URL} from "@/configs/config.js";

const API = `${BASE_URL}/lease`;

export const fetchActiveLeasesByOwnerId = async (userId) => {
    try {
        const response = await fetch(`${API}/active/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
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
        const response = await fetch(`${API}/${leaseId}`, {
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

export const fetchMyLease = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/user/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log(text)
    return text ? JSON.parse(text) : null;
}

export const fetchMyLeases = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/owner/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
}



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