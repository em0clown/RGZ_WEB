import React from 'react';

export default function CustomCard({ children, className = '', hover = true }) {
    return (
        <div className={`bg-gray-900 rounded-xl overflow-hidden ${hover ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl' : ''} ${className}`}>
            {children}
        </div>
    );
}
