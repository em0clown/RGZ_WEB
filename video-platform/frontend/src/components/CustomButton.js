import React from 'react';

export default function CustomButton({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    onClick, 
    className = '' 
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
        secondary: 'bg-gray-800 text-white hover:bg-gray-700',
        outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2 text-base',
        lg: 'px-7 py-3 text-lg',
    };
    
    return (
        <button
            onClick={onClick}
            className={`${variants[variant]} ${sizes[size]} rounded-full font-semibold transition-all duration-300 hover:scale-105 ${className}`}
        >
            {children}
        </button>
    );
}
