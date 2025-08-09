function MoveCard({ move }) {
    return (
        <div className="w-40 h-32 bg-gray-900 border-2 border-cyan-400 rounded-lg p-3 flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-cyan-300 text-base">{move.name}</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-700">{move.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-xs text-gray-200">
                <div>
                    <span className="font-semibold">
                        {move.baseStaminaCost < 0 ? "Stamina Gain" : "Stamina"}
                    </span>
                    : {move.baseStaminaCost < 0 ? -move.baseStaminaCost : move.baseStaminaCost}
                </div>
                {move.baseDamage > 0 && (
                    <div>
                        <span className="font-semibold">Damage</span>: {move.baseDamage}
                    </div>
                )}
                <div>
                    <span className="font-semibold">Momentum</span>: {move.baseMomentum}
                </div>
                {move.baseHeal > 0 && (
                    <div>
                        <span className="font-semibold">Heal</span>: {move.baseHeal}
                    </div>
                )}
            </div>
        </div>
    );
} 
export default MoveCard;