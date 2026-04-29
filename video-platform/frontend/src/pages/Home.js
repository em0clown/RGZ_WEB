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
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        
        let url;
        if (search) {
            url = `/videos/?search=${encodeURIComponent(search)}`;
        } else if (activeTab === 'recommended') {
            url = '/videos/recommended/';
        } else {
            url = '/videos/';
        }
        
        axios.get(url)
            .then(res => {
                setVideos(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [window.location.search, activeTab]);

    const clearSearch = () => {
        window.location.href = '/';
    };

    const search = new URLSearchParams(window.location.search).get('search');

    if (loading) return <LoadingSpinner />;

    return (
        <div className="pt-20 px-4 pb-8 min-h-screen">
            <div className="container mx-auto">
                {search ? (
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Результаты поиска: "{search}"</h1>
                        <button onClick={clearSearch} className="mt-2 text-purple-400 hover:text-purple-300">← Очистить поиск</button>
                    </div>
                ) : (
                    <div className="flex gap-4 mb-6">
                        <button onClick={() => setActiveTab('recommended')} className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${activeTab === 'recommended' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                            <FaFire /> Для вас
                        </button>
                        <button onClick={() => setActiveTab('latest')} className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${activeTab === 'latest' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                            <FaClock /> Новые
                        </button>
                    </div>
                )}

                {videos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        {search ? 'Ничего не найдено' : 'Видео пока нет'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map(video => <VideoCard key={video.id} video={video} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
