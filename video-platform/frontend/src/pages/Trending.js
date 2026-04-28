import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Trending() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await axios.get('/videos/trending/');
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching trending:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="pt-20 px-4 pb-8 bg-black min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">В тренде 🔥</h1>
                {videos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20"><p>Нет популярных видео</p></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map(video => <VideoCard key={video.id} video={video} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
