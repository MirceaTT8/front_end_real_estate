import {BASE_URL} from "@/configs/config.js";

const API = `${BASE_URL}/property`;

export const fetchPropertiesByUserId = async (userId) => {
    try {
        const response = await fetch(`${API}/user/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

export const fetchPropertyById = async (propertyId) => {
    try {
        const response = await fetch(`${API}/${propertyId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};


export const addProperty = async (propertyDTO, attachments) => {
    try {
        const formData = new FormData();

        // Convert propertyDTO to JSON blob
        const jsonBlob = new Blob(
            [JSON.stringify(propertyDTO)],
            { type: 'application/json' }
        );

        formData.append('propertyDTO', jsonBlob);

        if (attachments?.length) {
            attachments.forEach(attachment => {
                formData.append('images', attachment.file);
            });
        }

        const response = await fetch(`${API}`, {
            method: 'POST',
            body: formData  // Note: Don't set Content-Type header - the browser will set it with the correct boundary
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error('Adding property failed:', error);
        throw error;
    }
}