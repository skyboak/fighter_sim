import React, { useState } from "react";

function FighterCard({ fighter }) {
    const [imageError, setImageError] = useState(false);
    
    // Comprehensive null/undefined checks
    if (!fighter) {
        return (
            <div className="w-32 h-32 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
            </div>
        );
    }

    // Safe name extraction
    const fighterName = typeof fighter.name === 'string' ? fighter.name : 'Unknown Fighter';
    
    // Safe image URL extraction
    const imageUrl = typeof fighter.img === 'string' && fighter.img.trim() ? fighter.img : null;
    
    const handleImageError = () => {
        console.warn('Failed to load fighter image:', imageUrl);
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    return (
        <div className="w-32 h-32 bg-gray-800 border-2 border-cyan-400 rounded-lg flex flex-col items-center justify-center shadow-lg">
            {imageUrl && !imageError ? (
                <img
                    src={imageUrl}
                    alt={`${fighterName} avatar`}
                    className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-white"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            ) : (
                <div className="w-20 h-20 rounded-full bg-gray-600 mb-2 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">No Image</span>
                </div>
            )}
            <span className="text-white font-bold text-sm text-center px-1">
                {fighterName}
            </span>
        </div>
    );
}

export default FighterCard;