import React, { useState, useEffect } from 'react';
import { X, Trophy, RotateCcw } from 'lucide-react';
import wrestlers from './constants/wrestlers';
import Player from './logic/player';
import WrestlerSection from './components/wrestlerSection';
import MoveCard from './components/moveCard';

const GauntletMatch = () => {
  const [currentScreen, setCurrentScreen] = useState('title');
  const [fighterName, setFighterName] = useState('');
  const [skillPoints, setSkillPoints] = useState({
    luchadorSkill: 0,
    dirtySkill: 0,
    powerhouseSkill: 0,
    showmanSkill: 0,
    technicianSkill: 0,
    brawlerSkill: 0
  });
  const [defeatedFighters, setDefeatedFighters] = useState([]);
  const [currentFighter, setCurrentFighter] = useState(null);
  const [playerFighter, setPlayerFighter] = useState(null);
  const [selectedDiscards, setSelectedDiscards] = useState([]); 
  const totalSkillPoints = Object.values(skillPoints).reduce((a, b) => a + b, 0);
  const remainingPoints = 8 - totalSkillPoints;

  // Skill display names mapping
  const skillDisplayNames = {
    luchadorSkill: 'Luchador',
    dirtySkill: 'Dirty Player',
    powerhouseSkill: 'Powerhouse',
    showmanSkill: 'Showman',
    technicianSkill: 'Technician',
    brawlerSkill: 'Brawler'
  };

  // Helper function to get fighter's specialty
  const getFighterSpecialty = (fighter) => {
    const skills = [
      { name: 'Luchador', value: fighter.luchadorSkill },
      { name: 'Dirty Player', value: fighter.dirtySkill },
      { name: 'Powerhouse', value: fighter.powerhouseSkill },
      { name: 'Showman', value: fighter.showmanSkill },
      { name: 'Technician', value: fighter.technicianSkill },
      { name: 'Brawler', value: fighter.brawlerSkill }
    ];
    return skills.find(skill => skill.value === 8)?.name || 'Unknown';
  };

  const addSkillPoint = (skill) => {
    if (remainingPoints > 0) {
      setSkillPoints(prev => ({
        ...prev,
        [skill]: Math.min(prev[skill] + 1, 7)
      }));
    }
  };

  const resetGame = () => {
    setCurrentScreen('title');
    setFighterName('');
    setSkillPoints({
      luchadorSkill: 0,
      dirtySkill: 0,
      powerhouseSkill: 0,
      showmanSkill: 0,
      technicianSkill: 0,
      brawlerSkill: 0
    });
    setDefeatedFighters([]);
    setCurrentFighter(null);
    setPlayerFighter(null);
  };

  // Title Screen
  if (currentScreen === 'title') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold text-white mb-8 drop-shadow-lg">
          Gauntlet Match
        </h1>
        <p className="text-xl text-gray-300 mb-16">Made by Alon Barak</p>
        <button
          onClick={() => setCurrentScreen('fighterCreation')}
          className="px-12 py-4 text-2xl font-bold text-slate-900 bg-white rounded-full border-4 border-white hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-xl"
        >
          START GAME
        </button>
      </div>
    );
  }

  // Fighter Creation Screen
  if (currentScreen === 'fighterCreation') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-8">
        <div className="flex items-center justify-between w-full max-w-4xl mb-8">
          <h1 className="text-5xl font-bold text-white">Fighter Creation</h1>
        </div>

        <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-8 shadow-2xl">
          <div className="mb-8">
            <label className="text-3xl text-white mb-4 block">Name:</label>
            <input
              type="text"
              value={fighterName}
              onChange={(e) => setFighterName(e.target.value)}
              className="w-full px-4 py-3 text-2xl bg-transparent border-2 border-cyan-400 rounded-lg text-white focus:outline-none focus:border-cyan-300"
              placeholder="Enter fighter name"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl text-white mb-6">
              Skill points available: {remainingPoints}
            </h2>

            <div className="space-y-4">
              {Object.entries(skillPoints).map(([skill, value]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-2xl text-white w-48">
                    {skillDisplayNames[skill]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 ${
                            i < value
                              ? 'bg-cyan-400 border-cyan-400'
                              : 'bg-transparent border-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => addSkillPoint(skill)}
                      disabled={remainingPoints === 0 || value === 7}
                      className={`text-4xl font-bold w-12 h-12 flex items-center justify-center rounded ${
                        remainingPoints > 0 && value < 7
                          ? 'text-cyan-400 hover:bg-cyan-400/20'
                          : 'text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('selectFighter')}
            disabled={remainingPoints !== 0 || !fighterName}
            className={`w-full py-4 text-2xl font-bold rounded-lg transition-all ${
              remainingPoints === 0 && fighterName
                ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-300'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Fighter Selection
          </button>
        </div>
      </div>
    );
  }

  // Select Fighter Screen
  if (currentScreen === 'selectFighter') {
    const fighters = wrestlers;

    if (defeatedFighters.length === 6) {
      setCurrentScreen('championship');
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center px-8">
        <h1 className="text-5xl font-bold text-white mb-12">SELECT FIGHTER</h1>
        
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          {fighters.map((fighter, index) => {
            const isDefeated = defeatedFighters.includes(index);
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (!isDefeated) {
                    setCurrentFighter(fighter);
                    setCurrentScreen('match');
                  }
                }}
                disabled={isDefeated}
                className={`relative w-48 h-48 border-2 border-cyan-400 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isDefeated
                    ? 'bg-gray-800 cursor-not-allowed opacity-50'
                    : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                }`}
              >
                {isDefeated ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <X className="w-32 h-32 text-cyan-400" strokeWidth={3} />
                    </div>
                    <span className="absolute text-red-500 font-bold text-4xl transform rotate-12">
                      DEFEATED
                    </span>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <div className="text-gray-400 mb-4">
                      <div className="w-20 h-20 rounded-full border-2 border-gray-400 mb-2 mx-auto" />
                      <div className="w-20 h-16 border-2 border-gray-400 rounded-t-3xl border-b-0 mx-auto" />
                    </div>
                    <div className="text-white">
                      <div className="font-bold text-sm mb-1">
                        {fighter.name}
                      </div>
                      <div className="text-xs text-cyan-300">
                        {getFighterSpecialty(fighter)}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-white text-xl">
          Defeated: {defeatedFighters.length} / 6
        </div>
      </div>
    );
  }

  // Match Screen (Placeholder)
  if (currentScreen === 'match') {
    // 3bars fighter card, move cards, and buttons for actions vs and the same for opponent.

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center px-8">
        <div className="flex items-center justify-center gap-12 mb-8">
          <div>
            <WrestlerSection fighter={playerFighter} />
          </div>
          <div className="text-5xl font-extrabold text-cyan-400 mx-8 select-none">
            VS
          </div>
          <div>
            <WrestlerSection fighter={currentFighter} />
          </div>
        </div>
        <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-4 mt-8 shadow-lg">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Match Log</h2>
          <div className="h-40 overflow-y-auto bg-gray-800 rounded p-2 text-white text-sm font-mono">
            {/* TODO: Render match log entries here */}
            <div className="text-gray-500 italic">No actions yet.</div>
          </div>
        </div>
      </div>
    );
  }

  // Discard Screen
  if (currentScreen === 'cardSelect') {
    // need to show 4 cards that were drawn from the deck. user can select one to keep and discard the rest.

    // Example placeholders for drawn cards and pinfall card
    // Replace with your actual logic/data
    const drawnCards = playerFighter?.hand?.slice(0, 3) || [];
    const pinfallCard = playerFighter?.pinfallDeck?.[0] || null;

    

    const handleToggleDiscard = (idx) => {
      if (selectedDiscards.includes(idx)) {
        setSelectedDiscards(selectedDiscards.filter(i => i !== idx));
      } else if (selectedDiscards.length < 2) {
        setSelectedDiscards([...selectedDiscards, idx]);
      }
    };

    const handleConfirm = () => {
      if (selectedDiscards.length === 2) {
        // Implement your discard logic here
        // Example: remove selected cards from hand, keep the rest
        // ...
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Select 2 cards to discard</h1>
        <div className="flex gap-6 mb-8">
          {drawnCards.map((move, idx) => (
            <div
              key={idx}
              className={`transition-all ${selectedDiscards.includes(idx) ? 'ring-4 ring-red-500 scale-105' : 'ring-2 ring-transparent'} rounded-lg cursor-pointer`}
              onClick={() => handleToggleDiscard(idx)}
            >
              <MoveCard move={move} />
              <div className="text-center mt-2 text-sm text-white">
                {selectedDiscards.includes(idx) ? "Discarding" : ""}
              </div>
            </div>
          ))}
          <div>
            <MoveCard move={pinfallCard} />
            <div className="text-center mt-2 text-xs text-cyan-300 font-bold">Pinfall</div>
          </div>
        </div>
        <button
          className={`px-8 py-3 rounded-lg text-xl font-bold transition-all ${
            selectedDiscards.length === 2
              ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-300'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={selectedDiscards.length !== 2}
          onClick={handleConfirm}
        >
          Confirm Discards
        </button>
      </div>
    );
  }




  // Try Again Screen
  if (currentScreen === 'tryAgain') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-red-900 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white mb-4">DEFEATED</h1>
        <p className="text-2xl text-gray-300 mb-12">You have fallen in the gauntlet!</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setCurrentScreen('selectFighter')}
            className="px-12 py-4 bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg hover:bg-yellow-400 flex items-center gap-2"
          >
            <RotateCcw className="w-6 h-6" />
            Try Again
          </button>
          <button
            onClick={resetGame}
            className="px-12 py-4 bg-gray-700 text-white font-bold text-xl rounded-lg hover:bg-gray-600"
          >
            Return to Title
          </button>
        </div>
      </div>
    );
  }

  // Championship Win Screen
  if (currentScreen === 'championship') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-yellow-900 flex flex-col items-center justify-center">
        <Trophy className="w-32 h-32 text-yellow-300 mb-8 animate-bounce" />
        <h1 className="text-7xl font-bold text-white mb-4 text-center">
          CHAMPION!
        </h1>
        <p className="text-3xl text-yellow-100 mb-8 text-center">
          You have conquered the gauntlet!
        </p>
        <p className="text-2xl text-yellow-200 mb-12">
          Fighter: {fighterName}
        </p>
        
        <button
          onClick={resetGame}
          className="px-12 py-4 bg-white text-yellow-900 font-bold text-xl rounded-lg hover:bg-yellow-100 shadow-xl"
        >
          New Game
        </button>
      </div>
    );
  }


  


  return null;
};

export default GauntletMatch;