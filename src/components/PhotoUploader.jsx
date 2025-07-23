import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { uploadPhoto, getDestinationsByTripId } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

export default function PhotoUploader({ tripId, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [destinations, setDestinations] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await getDestinationsByTripId(tripId);
                setDestinations(data);
            } catch (err) {
                console.error('Error fetching destinations:', err);
            }
        };

        fetchDestinations();
    }, [tripId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const storageRef = ref(storage, `trip-photos/${uuidv4()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            await uploadPhoto(tripId, {
                image_url: imageUrl,
                caption,
                destination_id: destinationId || null,
            });

            setFile(null);
            setCaption('');
            setDestinationId('');
            onUploadSuccess?.();
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload photo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Form>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="formFile" className="mb-2">
                <Form.Label>Select Photo</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            <Form.Group controlId="caption" className="mb-2">
                <Form.Label>Caption</Form.Label>
                <Form.Control
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Optional caption"
                />
            </Form.Group>

            {destinations.length > 0 && (
                <Form.Group controlId="destinationSelect" className="mb-3">
                    <Form.Label>Attach to Destination (optional)</Form.Label>
                    <Form.Select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                    >
                        <option value="">-- No destination --</option>
                        {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                                {dest.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            )}

            <Button
                variant="primary"
                onClick={handleUpload}
                disabled={uploading || !file}
            >
                {uploading ? <Spinner size="sm" animation="border" /> : 'Upload'}
            </Button>
        </Form>
    );
}