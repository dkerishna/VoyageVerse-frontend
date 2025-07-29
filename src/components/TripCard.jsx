import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Image, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPhotosForTrip } from '../services/api';

export default function TripCard({ trip }) {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await getPhotosForTrip(trip.id);
                setPhotos(data.slice(0, 3)); // show only 3 photos for cleaner layout
            } catch (err) {
                console.error('Failed to fetch photos', err);
            }
        };

        fetchPhotos();
    }, [trip.id]);

    // Calculate trip status
    const getTripStatus = () => {
        const today = new Date();
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);

        if (today < startDate) return { status: 'upcoming', color: '#4dabf7', emoji: '⏳' };
        if (today > endDate) return { status: 'completed', color: '#51cf66', emoji: '✅' };
        return { status: 'ongoing', color: '#ff8787', emoji: '✈️' };
    };

    // Calculate days until/since trip
    const getDaysInfo = () => {
        const today = new Date();
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);

        if (today < startDate) {
            const days = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
            return `${days} days to go`;
        }
        if (today > endDate) {
            const days = Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
            return `${days} days ago`;
        }
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        return `${daysLeft} days left`;
    };

    // Format dates nicely
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate trip duration
    const getTripDuration = () => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return `${days} day${days > 1 ? 's' : ''}`;
    };

    const tripStatus = getTripStatus();

    return (
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/trip/${trip.id}`)}
        >
            {/* Hero Image Section */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                {trip.image_url ? (
                    <img
                        src={trip.image_url}
                        alt={trip.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem'
                        }}
                    >
                        🗺️
                    </div>
                )}

                {/* Status Badge */}
                <div
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: `${tripStatus.color}15`,
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${tripStatus.color}40`,
                        borderRadius: '20px',
                        padding: '8px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>{tripStatus.emoji}</span>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tripStatus.status}
                    </span>
                </div>

                {/* Gradient Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                    }}
                />

                {/* Location Tag */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        {trip.city}, {trip.country}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '25px' }}>
                {/* Title */}
                <h4
                    style={{
                        color: 'white',
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        lineHeight: '1.3'
                    }}
                >
                    {trip.title}
                </h4>

                {/* Trip Info Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>📅</span>
                        <div>
                            <div
                                style={{
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}
                            >
                                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                            </div>
                            <div
                                style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {getTripDuration()}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '15px',
                            padding: '8px 12px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <span
                            style={{
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}
                        >
                            {getDaysInfo()}
                        </span>
                    </div>
                </div>

                {/* Photos Preview */}
                {photos.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <div
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>📸</span>
                            Recent Photos
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                                overflow: 'hidden'
                            }}
                        >
                            {photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    style={{
                                        flex: '1',
                                        height: '60px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <img
                                        src={photo.image_url}
                                        alt={photo.caption || 'Trip photo'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/trip/${trip.id}`);
                        }}
                        style={{
                            flex: '1',
                            minWidth: '120px',
                            background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '15px',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                        }}
                    >
                        View Details
                    </button>

                    {photos.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/trips/${trip.id}/photos`);
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '2px solid rgba(255,255,255,0.25)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '15px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.25)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.15)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <span>📷</span>
                            Photos
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}