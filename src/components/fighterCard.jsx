import React from "react";

function FighterCard({ fighter }) {
    // fighter: { name, avatarUrl }
    return (
        <div className="w-32 h-32 bg-gray-800 border-2 border-cyan-400 rounded-lg flex flex-col items-center justify-center shadow-lg">
            <img
                src={fighter.img}
                alt={fighter.name}
                className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-white"
            />
            <span className="text-white font-bold text-base">{fighter.name}</span>
        </div>
    );
}

export default FighterCard;
