function Bar({ label, value, color, max = 100 }) {
  const safeMax = max || 100;
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const pct = Math.round(ratio * 100);
  const colorMap = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-400'
  };
  const barColor = colorMap[color] || 'bg-cyan-400';

  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}/{Math.round(safeMax)} ({pct}%)</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default Bar;