import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Subscriptions() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSubscriptions();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get('/videos/');
            setVideos(response.data.results || []);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-20 flex justify-center items-center h-screen bg-black">
                <div className="text-center"><p className="text-white text-xl">Войдите чтобы увидеть подписки</p></div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="pt-20 px-4 pb-8 bg-black min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Подписки</h1>
                {videos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20"><p>Нет видео от ваших подписок</p></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map(video => <VideoCard key={video.id} video={video} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
