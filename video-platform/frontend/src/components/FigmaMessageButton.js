import React from 'react';

export default function FigmaMessageButton({ onClick }) {
    return (
        <div className="property-1-default" style={{ cursor: 'pointer' }} onClick={onClick}>
            <p className="text-88">
                <span className="text-white">Хотите отправить сообщение? Кликните на эту кнопку</span>
            </p>
        </div>
    );
}
