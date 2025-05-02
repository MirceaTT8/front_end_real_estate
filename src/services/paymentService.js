import { BASE_URL } from "@/configs/config.js";

const PAYMENT_API = `${BASE_URL}/payment`;

export const getAllPayments = async () => {
    try {
        const response = await fetch(PAYMENT_API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all payments:', error);
        throw error;
    }
};

export const createPayment = async (leaseId, paymentRequest) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${PAYMENT_API}/${leaseId}`, {
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
        const response = await fetch(`${PAYMENT_API}/lease/${leaseId}`, {
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
        const response = await fetch(`${PAYMENT_API}/owner/${userId}`, {
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
        const response = await fetch(`${PAYMENT_API}/${paymentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching payment ${paymentId}:`, error);
        throw error;
    }
};

export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELED: 'CANCELED',
};