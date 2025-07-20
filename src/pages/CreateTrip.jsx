import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { createTrip } from '../services/api';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';

export default function CreateTrip() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setUploading(true);
            let imageUrl = '';

            if (image) {
                const imageRef = ref(storage, `trips/${currentUser.uid}/${uuidv4()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await createTrip({
                user_firebase_uid: currentUser.uid,
                title,
                notes,
                start_date: startDate,
                end_date: endDate,
                country,
                city,
                image_url: imageUrl,
            });

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to create trip. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Create a New Trip</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Trip Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                        type="text"
                        className="form-control"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="form-label">Upload Image (optional)</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Create Trip'}
                </button>
            </form>
        </div>
    );
}