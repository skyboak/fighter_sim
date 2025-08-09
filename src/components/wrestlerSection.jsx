import FighterCard from './fighterCard';
import MoveCard from './moveCard';
import Bar from './bar';

function WrestlerSection({ fighter }) {
  return (
    <div>
      <FighterCard fighter={fighter} />
      <div>
        <Bar label="Health" value={fighter.health} color="red" />
        <Bar label="Stamina" value={fighter.stamina} color="yellow" />
        <Bar label="Momentum" value={fighter.momentum} color="blue" />
      </div>
      <div>
        {(fighter.hand || []).map((move, idx) => (
          <MoveCard key={idx} move={move} />
        ))}
      </div>
    </div>
  );
}

export default WrestlerSection;
