import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFire, FaClock } from 'react-icons/fa';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recommended');

    useEffect(() => {
        if (activeTab === 'recommended') {
            fetchRecommended();
        } else {
            fetchLatest();
        }
    }, [activeTab]);

    const fetchRecommended = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/videos/recommended/');
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching recommended:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLatest = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/videos/');
            setVideos(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="pt-20 px-4 pb-8  min-h-screen">
            <div className="container mx-auto">
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('recommended')} className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${activeTab === 'recommended' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        <FaFire /> Для вас
                    </button>
                    <button onClick={() => setActiveTab('latest')} className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${activeTab === 'latest' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        <FaClock /> Новые
                    </button>
                </div>
                {videos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20"><p className="text-xl">Видео пока нет</p><p className="mt-2">Станьте первым, кто загрузит видео!</p></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map(video => <VideoCard key={video.id} video={video} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
