import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaLink, FaEdit, FaCheck, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Profile() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [userVideos, setUserVideos] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subCount, setSubCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: '',
        location: '',
        website: '',
        birth_date: ''
    });
    const [loading, setLoading] = useState(true);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const isOwnProfile = currentUser && currentUser.username === username;

    useEffect(() => {
        if (username) {
            fetchUser();
        }
    }, [username, currentUser]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/users/');
            const found = response.data.results?.find(u => u.username === username);
            if (found) {
                setProfileUser(found);
                setSubCount(found.subscriber_count || 0);
                setEditForm({
                    bio: found.bio || '',
                    location: found.location || '',
                    website: found.website || '',
                    birth_date: found.birth_date || ''
                });
                fetchUserVideos(found.id);
            } else {
                toast.error('Пользователь не найден');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Ошибка загрузки профиля');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserVideos = async (userId) => {
        try {
            const response = await axios.get(`/users/${userId}/videos/`);
            setUserVideos(response.data);
        } catch (error) {
            console.error('Error fetching user videos:', error);
        }
    };

    const handleSubscribe = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.post(`/users/${profileUser.id}/subscribe/`);
            setIsSubscribed(response.data.status === 'subscribed');
            setSubCount(response.data.count);
            toast.success(response.data.status === 'subscribed' ? 'Подписан' : 'Отписан');
        } catch (error) {
            toast.error('Ошибка');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Не авторизован');
            return;
        }
        
        try {
            const response = await axios.patch(
                `/users/${profileUser.id}/update-profile/`,
                {
                    bio: editForm.bio,
                    location: editForm.location,
                    website: editForm.website,
                    birth_date: editForm.birth_date || null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data) {
                setProfileUser(response.data);
                setIsEditing(false);
                toast.success('Профиль обновлен!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.error || 'Ошибка обновления профиля');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Не авторизован');
            return;
        }
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        try {
            const response = await axios.post(
                `/users/${profileUser.id}/upload-avatar/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            setProfileUser(response.data);
            toast.success('Аватар обновлен!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error(error.response?.data?.error || 'Ошибка загрузки аватара');
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Не авторизован');
            return;
        }
        
        const formData = new FormData();
        formData.append('banner', file);
        
        try {
            const response = await axios.post(
                `/users/${profileUser.id}/upload-banner/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            setProfileUser(response.data);
            toast.success('Баннер обновлен!');
        } catch (error) {
            console.error('Error uploading banner:', error);
            toast.error(error.response?.data?.error || 'Ошибка загрузки баннера');
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-white">Загрузка...</div>;
    if (!profileUser) return null;

    return (
        <div className="pt-16 bg-black min-h-screen">
            {/* Баннер */}
            <div className="relative h-48 bg-gradient-to-r from-purple-900 to-pink-900">
                {getImageUrl(profileUser.banner) && (
                    <img src={getImageUrl(profileUser.banner)} alt="Banner" className="w-full h-full object-cover" />
                )}
                {isOwnProfile && (
                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute bottom-4 right-4 bg-black bg-opacity-60 hover:bg-opacity-80 px-4 py-2 rounded-lg text-white text-sm transition flex items-center gap-2 cursor-pointer z-10"
                    >
                        <FaCamera /> Изменить баннер
                    </button>
                )}
                <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </div>
            
            <div className="container mx-auto px-4">
                <div className="relative -mt-16 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                        {/* Аватар */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-black overflow-hidden">
                                {getImageUrl(profileUser.avatar) ? (
                                    <img src={getImageUrl(profileUser.avatar)} alt={profileUser.username} className="w-full h-full object-cover" />
                                ) : (
                                    <FaUserCircle className="text-6xl text-gray-400" />
                                )}
                            </div>
                            {isOwnProfile && (
                                <>
                                    <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer">
                                        <FaCamera className="text-white text-xs" />
                                    </button>
                                    <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                </>
                            )}
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-white">{profileUser.username}</h1>
                            
                            {!isEditing ? (
                                <>
                                    <p className="text-gray-400 mt-2">{profileUser.bio || 'Нет описания'}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-sm text-gray-500">
                                        {profileUser.location && <span className="flex items-center gap-1"><FaMapMarkerAlt /> {profileUser.location}</span>}
                                        {profileUser.website && <span className="flex items-center gap-1"><FaLink /> <a href={profileUser.website} target="_blank" className="text-purple-400">{profileUser.website}</a></span>}
                                        {profileUser.birth_date && <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(profileUser.birth_date).getFullYear()}</span>}
                                    </div>
                                </>
                            ) : (
                                <div className="mt-4 space-y-3 max-w-md mx-auto md:mx-0">
                                    <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} placeholder="О себе" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" rows="2" />
                                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Местоположение" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                    <input type="url" value={editForm.website} onChange={(e) => setEditForm({...editForm, website: e.target.value})} placeholder="Веб-сайт" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                    <input type="date" value={editForm.birth_date} onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})} className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            {isOwnProfile ? (
                                !isEditing ? (
                                    <button onClick={handleEdit} className="px-6 py-2 bg-gray-700 rounded-full text-white">
                                        <FaEdit className="inline mr-2" /> Редактировать
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="px-6 py-2 bg-green-600 rounded-full text-white">
                                        <FaCheck className="inline mr-2" /> Сохранить
                                    </button>
                                )
                            ) : (
                                <button onClick={handleSubscribe} className={`px-6 py-2 rounded-full ${isSubscribed ? 'bg-gray-700' : 'bg-red-600'} text-white`}>
                                    {isSubscribed ? 'Отписаться' : 'Подписаться'}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-6 mt-6 justify-center md:justify-start">
                        <div className="text-center"><div className="text-xl font-bold text-white">{subCount}</div><div className="text-sm text-gray-400">подписчиков</div></div>
                        <div className="text-center"><div className="text-xl font-bold text-white">{userVideos.length}</div><div className="text-sm text-gray-400">видео</div></div>
                        <div className="text-center"><div className="text-xl font-bold text-white">{profileUser.like_count || 0}</div><div className="text-sm text-gray-400">лайков</div></div>
                    </div>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Видео</h2>
                    {userVideos.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 bg-gray-900 rounded-lg">
                            <p>Нет видео</p>
                            {isOwnProfile && <Link to="/upload" className="inline-block mt-4 px-6 py-2 bg-purple-600 rounded-full">Загрузить видео</Link>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {userVideos.map(video => <VideoCard key={video.id} video={video} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
