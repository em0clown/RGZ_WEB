import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
            <div className="flex items-center justify-between px-4 py-3">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    VideoHub
                </Link>
                
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-full text-white focus:outline-none focus:border-purple-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </form>
                
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="relative group">
                            <Link to={`/profile/${user.username}`} className="flex items-center space-x-2">
                                <FaUserCircle className="text-2xl text-gray-400" />
                                <span className="hidden md:inline text-white">{user.username}</span>
                            </Link>
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg hidden group-hover:block">
                                <Link to={`/profile/${user.username}`} className="block px-4 py-2 hover:bg-gray-700">Профиль</Link>
                                <Link to="/upload" className="block px-4 py-2 hover:bg-gray-700">Загрузить видео</Link>
                                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400">
                                    Выйти
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
