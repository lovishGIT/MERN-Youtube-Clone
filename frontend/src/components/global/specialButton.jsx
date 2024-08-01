import React from 'react';

export default function SpecialButton({ children }) {
    return (
        <button className="bg-gradient-to-r from-[#FF4A9A] to-[#007EF8] text-white p-2 rounded-md hover:opacity-90 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007EF8] text-shadow-lg">
            {children}
        </button>
    );
}
