import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaBell, FaBellSlash, FaShare, FaExpand, FaVolumeUp, FaPlay, FaPause } from 'react-icons/fa';

export default function VideoPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const videoRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subCount, setSubCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        fetchVideo();
        fetchComments();
        incrementView();
    }, [id]);

    const fetchVideo = async () => {
        try {
            const response = await axios.get(`/videos/${id}/`);
            setVideo(response.data);
            setIsLiked(response.data.is_liked || false);
            setLikesCount(response.data.like_count || 0);
            setSubCount(response.data.author?.subscriber_count || 0);
        } catch (error) {
            console.error('Error fetching video:', error);
            navigate('/');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/videos/${id}/comments/`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const incrementView = async () => {
        try {
            await axios.post(`/videos/${id}/view/`);
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    };

    const handleLike = async () => {
        if (!user) { toast.error('Войдите чтобы поставить лайк'); return; }
        try {
            const response = await axios.post(`/videos/${id}/like/`);
            setIsLiked(response.data.status === 'liked');
            setLikesCount(response.data.count);
        } catch (error) { toast.error('Ошибка'); }
    };

    const handleSubscribe = async () => {
        if (!user) { toast.error('Войдите чтобы подписаться'); return; }
        if (user.id === video.author.id) { toast.error('Нельзя подписаться на себя'); return; }
        try {
            const response = await axios.post(`/users/${video.author.id}/subscribe/`);
            setIsSubscribed(response.data.status === 'subscribed');
            setSubCount(response.data.count);
            toast.success(response.data.status === 'subscribed' ? 'Подписан' : 'Отписан');
        } catch (error) { toast.error('Ошибка'); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) { toast.error('Войдите чтобы оставить комментарий'); return; }
        if (!newComment.trim()) return;
        try {
            await axios.post(`/videos/${id}/comments/`, { text: newComment });
            setNewComment('');
            fetchComments();
            toast.success('Комментарий добавлен');
        } catch (error) { toast.error('Ошибка'); }
    };

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        if (avatar.startsWith('http')) return avatar;
        return `http://localhost:8000${avatar}`;
    };

    if (!video) return <div className="flex justify-center items-center h-screen text-white">Загрузка...</div>;

    return (
        <div className="pt-16 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/4">
                        <div className="relative bg-black rounded-xl overflow-hidden group">
                            <video
                                ref={videoRef}
                                className="w-full"
                                onClick={() => videoRef.current?.play()}
                                src={video.video_file}
                            />
                        </div>
                        
                        <div className="mt-4">
                            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
                            
                            <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-800 flex-wrap gap-4">
                                <Link to={`/profile/${video.author?.username}`} className="flex items-center space-x-3 group">
                                    {getAvatarUrl(video.author?.avatar) ? (
                                        <img src={getAvatarUrl(video.author?.avatar)} alt={video.author?.username} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {video.author?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-purple-400">{video.author?.username}</p>
                                        <p className="text-sm text-gray-400">{subCount} подписчиков</p>
                                    </div>
                                </Link>
                                
                                <div className="flex items-center gap-3">
                                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${isLiked ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                                        <span>{likesCount}</span>
                                    </button>
                                    <button onClick={handleSubscribe} className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${isSubscribed ? 'bg-gray-700' : 'bg-red-600'} text-white`}>
                                        {isSubscribed ? <FaBellSlash /> : <FaBell />}
                                        <span>{isSubscribed ? 'Отписаться' : 'Подписаться'}</span>
                                    </button>
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Ссылка скопирована!'); }} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition text-white">
                                        <FaShare /> Поделиться
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                                <p className="text-gray-300 whitespace-pre-wrap">{video.description || 'Нет описания'}</p>
                                <p className="text-sm text-gray-500 mt-2">{video.views?.toLocaleString()} просмотров</p>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Комментарии ({comments.length})</h3>
                                
                                <form onSubmit={handleComment} className="mb-6">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={user ? "Напишите комментарий..." : "Войдите чтобы оставить комментарий"}
                                            disabled={!user}
                                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                        />
                                        {user && (
                                            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                                                Отправить
                                            </button>
                                        )}
                                    </div>
                                </form>
                                
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {comments.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">Нет комментариев. Будьте первым!</div>
                                    ) : (
                                        comments.map(comment => (
                                            <div key={comment.id} className="p-4 bg-gray-900 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    {getAvatarUrl(comment.user?.avatar) ? (
                                                        <img src={getAvatarUrl(comment.user?.avatar)} alt={comment.user?.username} className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm">
                                                            {comment.user?.username?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <Link to={`/profile/${comment.user?.username}`} className="font-semibold text-purple-400 hover:underline">
                                                            {comment.user?.username}
                                                        </Link>
                                                        <span className="text-gray-500 text-xs ml-2">{moment(comment.created_at).fromNow()}</span>
                                                        <p className="text-gray-300 mt-1">{comment.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/4">
                        <h3 className="text-xl font-bold text-white mb-4">🎬 Рекомендации</h3>
                        <div className="text-gray-500 text-center py-8 bg-gray-900 rounded-lg">
                            Скоро здесь будут рекомендации
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
