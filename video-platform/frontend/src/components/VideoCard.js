import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import moment from 'moment';

export default function VideoCard({ video }) {
    const getAvatarUrl = () => {
        if (video.author?.avatar) {
            if (video.author.avatar.startsWith('http')) return video.author.avatar;
            return `http://localhost:8000${video.author.avatar}`;
        }
        return null;
    };

    return (
        <Link to={`/video/${video.id}`} className="block group">
            <div className="bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105">
                <div className="relative pb-[56.25%]">
                    {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                            <span className="text-4xl">🎬</span>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-white line-clamp-2 text-sm group-hover:text-purple-400">
                        {video.title}
                    </h3>
                    <Link to={`/profile/${video.author?.username}`} className="flex items-center space-x-2 mt-2">
                        {getAvatarUrl() ? (
                            <img src={getAvatarUrl()} alt={video.author?.username} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                            <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px]">{video.author?.username?.[0]?.toUpperCase()}</span>
                            </div>
                        )}
                        <span className="text-xs text-gray-400 hover:text-purple-400">{video.author?.username}</span>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center space-x-1 text-xs text-gray-500">
                            <FaEye className="text-xs" />
                            <span>{video.views?.toLocaleString()}</span>
                        </span>
                        <span className="text-xs text-gray-500">{moment(video.created_at).fromNow()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
