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

export const approveLeaseTermination = async (leaseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/${leaseId}/terminate-decision?decision=APPROVED`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve lease termination');
    }

    return await response.json();
};

export const fetchPendingLeaseTerminations = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/termination-requests`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pending lease terminations');
    }

    return await response.json();
};

export const fetchPendingLeases = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/lease/pending`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pending leases');
    }

    return await response.json();
};

export const approveLease = async (leaseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/${leaseId}/approve`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve lease');
    }

    return await response.json();
};

export const rejectLease = async (leaseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/${leaseId}/reject`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject lease');
    }

    return await response.json();
};

export const requestLeaseTermination = async (leaseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/${leaseId}/terminate-request`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to request lease termination');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const decideLeaseTermination = async (leaseId, decision) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/${leaseId}/terminate-decision?decision=${decision}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process lease termination decision');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};



