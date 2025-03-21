import {BASE_URL} from "@/configs/config.js";

const API = `${BASE_URL}/user`;

export const fetchUserById = async (id) => {
    try {
        const data = await fetch(`${API}/${id}`);
        return await data.json();
    } catch (error) {
        console.error(error);
    }
};