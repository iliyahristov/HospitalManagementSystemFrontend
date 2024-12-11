import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchItems = async (resource) => {
    const response = await axios.get(`${API_BASE_URL}/${resource}`);
    return response.data;
};

export const saveItem = async (resource, item) => {
    if (item.id) {
        await axios.put(`${API_BASE_URL}/${resource}/${item.id}`, item);
    } else {
        await axios.post(`${API_BASE_URL}/${resource}`, item);
    }
};

export const deleteItem = async (resource, id) => {
    await axios.delete(`${API_BASE_URL}/${resource}/${id}`);
};
