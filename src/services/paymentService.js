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
        const response = await fetch(`${PAYMENT_API}/${leaseId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // Add authorization if needed: 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentRequest)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Payment failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const getPaymentsByLeaseId = async (leaseId) => {
    try {
        const response = await fetch(`${PAYMENT_API}/lease/${leaseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching payments for lease ${leaseId}:`, error);
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

// Optional: Add payment status constants if needed
export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};