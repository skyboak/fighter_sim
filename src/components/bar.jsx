  function Bar({ label, value, color }) {
    return (
      <div className="mb-2 w-full">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded">
          <div
            className={`${color} h-4 rounded`}
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
        </div>
      </div>
    );
  }

export default Bar;