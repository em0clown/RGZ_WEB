import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaLink, FaEdit, FaCheck, FaCamera, FaImage, FaBell, FaBellSlash } from 'react-icons/fa';
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
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [editForm, setEditForm] = useState({ bio: '', location: '', website: '', birth_date: '' });
    const [loading, setLoading] = useState(true);
    const avatarInputRef = useRef(null);

    const isOwnProfile = currentUser && currentUser.username === username;

    useEffect(() => {
        if (username) fetchUser();
    }, [username, currentUser]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/users/');
            const found = response.data.results?.find(u => u.username === username);
            if (found) {
                setProfileUser(found);
                setSubCount(found.subscriber_count);
                setEditForm({ bio: found.bio || '', location: found.location || '', website: found.website || '', birth_date: found.birth_date || '' });
                fetchUserVideos(found.id);
                if (currentUser && currentUser.id !== found.id) checkSubscription(found.id);
            } else {
                toast.error('Пользователь не найден');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
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

    const checkSubscription = async (userId) => {
        try {
            const response = await axios.get('/users/me/');
            if (response.data && response.data.subscribers) {
                setIsSubscribed(response.data.subscribers.includes(userId));
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const handleSubscribe = async () => {
        if (!currentUser) { navigate('/login'); return; }
        try {
            const response = await axios.post(`/users/${profileUser.id}/subscribe/`);
            setIsSubscribed(response.data.status === 'subscribed');
            setSubCount(response.data.count);
            toast.success(response.data.status === 'subscribed' ? 'Подписан' : 'Отписан');
        } catch (error) { toast.error('Ошибка'); }
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.patch(`/users/${profileUser.id}/update-profile/`, editForm, { headers: { 'Authorization': `Bearer ${token}` } });
            setProfileUser(response.data);
            setIsEditing(false);
            toast.success('Профиль обновлен!');
        } catch (error) { toast.error('Ошибка обновления профиля'); }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Можно загружать только изображения'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Размер файла не должен превышать 5MB'); return; }
        const formData = new FormData();
        formData.append('avatar', file);
        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`/users/${profileUser.id}/upload-avatar/`, formData, { headers: { 'Authorization': `Bearer ${token}` } });
            setProfileUser(response.data);
            toast.success('Аватар обновлен!');
        } catch (error) { toast.error('Ошибка загрузки аватара'); }
        finally { setUploadingAvatar(false); }
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
            <div className="h-48 bg-gradient-to-r from-purple-900 to-pink-900 relative">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            <div className="container mx-auto px-4">
                <div className="relative -mt-16 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-black overflow-hidden">
                                {getImageUrl(profileUser.avatar) ? <img src={getImageUrl(profileUser.avatar)} alt={profileUser.username} className="w-full h-full object-cover" /> : <FaUserCircle className="text-6xl text-gray-400" />}
                            </div>
                            {isOwnProfile && (<>
                                <button onClick={() => avatarInputRef.current.click()} className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2"><FaCamera className="text-white text-xs" /></button>
                                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                            </>)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-white">{profileUser.username}</h1>
                            {!isEditing ? (<>
                                <p className="text-gray-400 mt-2">{profileUser.bio || 'Нет описания'}</p>
                                <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-sm text-gray-500">
                                    {profileUser.location && <span className="flex items-center gap-1"><FaMapMarkerAlt /> {profileUser.location}</span>}
                                    {profileUser.website && <span className="flex items-center gap-1"><FaLink /> <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-purple-400">{profileUser.website}</a></span>}
                                    {profileUser.birth_date && <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(profileUser.birth_date).getFullYear()}</span>}
                                </div>
                            </>) : (
                                <div className="mt-4 space-y-3">
                                    <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} placeholder="О себе" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" rows="2" />
                                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Местоположение" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                    <input type="url" value={editForm.website} onChange={(e) => setEditForm({...editForm, website: e.target.value})} placeholder="Веб-сайт" className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                    <input type="date" value={editForm.birth_date} onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})} className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {isOwnProfile ? (!isEditing ? <button onClick={handleEdit} className="px-6 py-2 bg-gray-700 rounded-full"><FaEdit className="inline mr-2" /> Редактировать</button> : <button onClick={handleSave} className="px-6 py-2 bg-green-600 rounded-full"><FaCheck className="inline mr-2" /> Сохранить</button>) : (<button onClick={handleSubscribe} className={`px-6 py-2 rounded-full ${isSubscribed ? 'bg-gray-700' : 'bg-red-600'} text-white`}>{isSubscribed ? <FaBellSlash className="inline mr-2" /> : <FaBell className="inline mr-2" />}{isSubscribed ? 'Отписаться' : 'Подписаться'}</button>)}
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
                    {userVideos.length === 0 ? (<div className="text-center text-gray-500 py-12 bg-gray-900 rounded-lg"><p>Нет видео</p></div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{userVideos.map(video => <VideoCard key={video.id} video={video} />)}</div>)}
                </div>
            </div>
        </div>
    );
}
