import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UploadVideo() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_file: null,
        thumbnail: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.video_file) {
            toast.error('Выберите видео файл');
            return;
        }
        
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('video_file', formData.video_file);
        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }
        
        try {
            const response = await axios.post('/videos/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Видео успешно загружено!');
            navigate(`/video/${response.data.id}`);
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error('Ошибка загрузки видео');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 px-4 pb-8 bg-black min-h-screen">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-gray-900 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Загрузить видео</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Название видео *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Описание</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows="4"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Видео файл *</label>
                            <input
                                type="file"
                                onChange={(e) => setFormData({...formData, video_file: e.target.files[0]})}
                                accept="video/*"
                                required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Превью (опционально)</label>
                            <input
                                type="file"
                                onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                                accept="image/*"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                            <p className="text-gray-500 text-sm mt-1">Рекомендуемый размер: 1280x720px</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Загрузка...' : 'Опубликовать видео'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
