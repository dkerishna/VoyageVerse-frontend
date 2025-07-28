import axios from 'axios';

// Base URL (Vercel or localhost)
// const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';
const API_URL = 'https://travel-companion-backend-seven.vercel.app';

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

export const updateDestination = async (destinationId, destinationData) => {
    const res = await api.put(`/destinations/${destinationId}`, destinationData);
    return res.data;
};

export const deleteDestination = async (destinationId) => {
    const res = await api.delete(`/destinations/${destinationId}`);
    return res.data;
};

// ==========================
// Photo API functions
// ==========================

export const getPhotosForTrip = async (tripId) => {
    const response = await api.get(`/trips/${tripId}/photos`);
    return response.data;
};

// Upload a new photo
export const uploadPhoto = async (tripId, photoData) => {
    const response = await api.post(`/trips/${tripId}/photos`, photoData);
    return response.data;
};

// Delete a photo
export const deletePhoto = async (photoId) => {
    const response = await api.delete(`/photos/${photoId}`);
    return response.data;
};

// ============================
// User Profile API functions
// ============================

// Get user profile
export const getUserProfile = async () => {
    try {
        const res = await api.get('/user/profile');
        return res.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null; // Profile not found
        }
        throw error;
    }
};

// Create or update user profile
export const saveUserProfile = async (profileData) => {
    const payload = {
        display_name: profileData.displayName,
        location: profileData.location,
        location_lat: profileData.locationCoords?.lat || null,
        location_lng: profileData.locationCoords?.lng || null,
        travel_style: profileData.travelStyle,
        favorite_destinations: profileData.favoriteDestinations,
        bio: profileData.bio,
        profile_picture_url: profileData.profilePicture
    };

    const res = await api.put('/user/profile', payload);
    return res.data;
};

// Get user profile stats (optional)
export const getUserProfileStats = async () => {
    const res = await api.get('/user/profile/stats');
    return res.data;
};