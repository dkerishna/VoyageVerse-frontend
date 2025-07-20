import axios from 'axios';

// Base URL (Vercel or localhost)
// const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_URL = 'https://travel-companion-backend-seven.vercel.app/api';

console.log("API base URL is:", API_URL);

// Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add auth token from localStorage (assumes it's stored there after login)
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// =====================
// Trip API functions
// =====================

export const getAllTrips = async () => {
    const res = await api.get('/trips/all'); // Admin only
    return res.data;
};

export const getUserTrips = async () => {
    const res = await api.get('/trips');
    console.log('Fetched trips:', res.data);
    return res.data;
};

export const getTripById = async (id) => {
    const res = await api.get(`/trips/${id}`);
    return res.data;
};

export const createTrip = async (tripData) => {
    const res = await api.post('/trips', tripData);
    return res.data;
};

export const updateTrip = async (id, tripData) => {
    const res = await api.put(`/trips/${id}`, tripData);
    return res.data;
};

export const deleteTrip = async (id) => {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
};

// ==========================
// Destination API functions
// ==========================

export const getDestinationsByTripId = async (tripId) => {
    const res = await api.get(`/trips/${tripId}/destinations`);
    return res.data;
};

export const addDestination = async (tripId, destinationData) => {
    const res = await api.post(`/trips/${tripId}/destinations`, destinationData);
    return res.data;
};

export const updateDestination = async (tripId, destinationId, destinationData) => {
    const res = await api.put(`/trips/${tripId}/destinations/${destinationId}`, destinationData);
    return res.data;
};

export const deleteDestination = async (tripId, destinationId) => {
    const res = await api.delete(`/trips/${tripId}/destinations/${destinationId}`);
    return res.data;
};