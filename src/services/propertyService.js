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

export const addProperty = async (propertyDTO) => {
    try{
        const response = await fetch(`${API}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(propertyDTO),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch(error){
        console.log('Adding property failed: ', error);
    }
}