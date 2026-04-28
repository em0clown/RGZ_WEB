import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFire, FaUser, FaUpload, FaHeart } from 'react-icons/fa';

export default function Sidebar() {
    const location = useLocation();
    
    const menuItems = [
        { path: '/', icon: <FaHome className="text-xl" />, label: 'Главная' },
        { path: '/trending', icon: <FaFire className="text-xl" />, label: 'В тренде' },
        { path: '/subscriptions', icon: <FaHeart className="text-xl" />, label: 'Подписки' },
        { path: '/upload', icon: <FaUpload className="text-xl" />, label: 'Загрузить' },
    ];
    
    return (
        <div className="fixed left-0 top-16 w-64 h-full bg-gray-900 border-r border-gray-800 overflow-y-auto hidden lg:block">
            <div className="py-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition ${
                            location.pathname === item.path ? 'bg-gray-800 text-purple-500' : 'text-gray-300'
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
