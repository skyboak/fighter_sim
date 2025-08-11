import FighterCard from './fighterCard';
import MoveCard from './moveCard';
import Bar from './bar';

function WrestlerSection({ fighter }) {
  if (!fighter) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <FighterCard fighter={fighter} />
      <div>
        <Bar label="Health" value={fighter.health || 100} color="red" />
        <Bar label="Stamina" value={fighter.stamina || 100} color="yellow" />
        <Bar label="Momentum" value={fighter.momentum || 0} color="blue" />
      </div>
      <div>
        {(fighter.hand || []).map((move, idx) => (
          <MoveCard key={`move-${idx}`} move={move} />
        ))}
      </div>
    </div>
  );
}

export default WrestlerSection;
