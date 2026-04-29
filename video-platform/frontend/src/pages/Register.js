import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) {
            alert('Пароли не совпадают');
            return;
        }
        setLoading(true);
        const success = await register(formData);
        setLoading(false);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Регистрация</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={formData.password2}
                        onChange={(e) => setFormData({...formData, password2: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Уже есть аккаунт? <Link to="/login" className="text-purple-400 hover:text-purple-300">Войти</Link>
                </p>
            </div>
        </div>
    );
}
