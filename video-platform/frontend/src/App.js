import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import UploadVideo from './pages/UploadVideo';
import Profile from './pages/Profile';
import Subscriptions from './pages/Subscriptions';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
                    <Navbar />
                    <div className="flex">
                        <Sidebar />
                        <div className="flex-1 ml-0 lg:ml-64">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/video/:id" element={<VideoPlayer />} />
                                <Route path="/profile/:username?" element={<Profile />} />
                                <Route path="/subscriptions" element={<Subscriptions />} />
                                <Route path="/upload" element={
                                    <PrivateRoute>
                                        <UploadVideo />
                                    </PrivateRoute>
                                } />
                            </Routes>
                        </div>
                    </div>
                    <Toaster position="top-right" />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
