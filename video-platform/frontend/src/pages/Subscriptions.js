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
        setLoading(true);
        try {
            // Используем новый эндпоинт для подписок
            const response = await axios.get('/videos/subscriptions/');
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-20 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-white text-xl">Войдите чтобы увидеть подписки</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    >
                        Войти
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="pt-20 px-4 pb-8 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Ваши подписки</h1>
                {videos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-900 rounded-lg">
                        <p className="text-xl">Нет видео от ваших подписок</p>
                        <p className="mt-2 text-gray-400">Подпишитесь на каналы, чтобы видеть их видео здесь</p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                        >
                            На главную
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
