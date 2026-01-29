import axios from '../utils/axios';

export const getAllUsers = async (search = '') => {
    const response = await axios.get(`/api/users${search ? `?search=${search}` : ''}`);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
};

export const getUserTopics = async (id) => {
    const response = await axios.get(`/api/users/${id}/topics`);
    return response.data;
};
