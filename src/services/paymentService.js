import { BASE_URL } from "@/configs/config.js";

const API = `${BASE_URL}/payment`;

export const getAllPayments = async () => {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all payments:', error);
        throw error;
    }
};

export const fetchPaymentsForOwner = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/owner/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};


export const createPayment = async (leaseId, paymentRequest) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API}/${leaseId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentRequest)
        });

        if (!response.ok) {
            let errorData = null;
            try {
                errorData = await response.json();
            } catch (_) {}

            throw new Error(errorData?.message || `Payment failed with status: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 0) {
            return await response.json();
        }

        return {};
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const getPaymentsByLeaseId = async (leaseId) => {
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
        console.error(`Error fetching payments for lease ${leaseId}:`, error);
        throw error;
    }
};

export const getPaymentsByOwnerId = async (userId) => {
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
        console.error(`Error fetching payments for lease ${userId}:`, error);
        throw error;
    }
};

export const getPaymentById = async (paymentId) => {
    try {
        const response = await fetch(`${API}/${paymentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching payment ${paymentId}:`, error);
        throw error;
    }
};

export const createStripeCheckoutSession = async (leaseId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API}/stripe/create-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ leaseId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Stripe session creation failed with status: ${response.status}`);
    }

    return await response.json(); // { id: sessionId }
};


export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELED: 'CANCELED',
};