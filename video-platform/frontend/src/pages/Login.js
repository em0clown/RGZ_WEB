import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(username, password);
        setLoading(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Вход</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Нет аккаунта? <Link to="/register" className="text-purple-400 hover:text-purple-300">Регистрация</Link>
                </p>
            </div>
        </div>
    );
}
