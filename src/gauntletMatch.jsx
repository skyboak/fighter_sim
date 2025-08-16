import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy } from 'lucide-react';
import wrestlers from './constants/wrestlers';
import Player from './logic/player';
import WrestlerSection from './components/wrestlerSection';
import MoveCard from './components/moveCard';
import { moves } from './constants/moves';
import { 
  handleMoveSelection, 
  finalizePlayerHand, 
  restoreStaminaAndHealth, 
  initializeMatch,
  opponentMoveSelection,
  executeMove,
  attemptPinfall
} from './logic/game';
import { getSpecialMove } from './logic/deck';
import FighterTypes, { FighterTypeMeta } from './fighterTypes';
import GenericWrestlerImg from './assets/genericWrestler.png';

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
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [drawnCards, setDrawnCards] = useState([]);
  const [matchLog, setMatchLog] = useState([]);
  const [matchWinner, setMatchWinner] = useState(null);
  const [awaitingNextRound, setAwaitingNextRound] = useState(false);
  const [isProcessingRound, setIsProcessingRound] = useState(false);
  const [renderTick, setRenderTick] = useState(0); // force re-render without losing prototypes
  const logEndRef = useRef(null);
  const logContainerRef = useRef(null); // container for controlled auto-scroll

  // Auto-scroll ONLY the log area (not entire page) and only if user is near bottom
  useEffect(() => {
    const container = logContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const nearBottom = distanceFromBottom < 40; // px threshold
    if (nearBottom && logEndRef.current) {
      // Use block:'nearest' to avoid page jump
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [matchLog]);
  
  const totalSkillPoints = Object.values(skillPoints).reduce((a, b) => a + b, 0);
  const remainingPoints = 8 - totalSkillPoints;

  // Skill display names mapping
  const skillDisplayNames = {
    luchadorSkill: FighterTypeMeta[FighterTypes.LUCHADOR].name,
    dirtySkill: 'Dirty Player',
    powerhouseSkill: FighterTypeMeta[FighterTypes.POWERHOUSE].name,
    showmanSkill: FighterTypeMeta[FighterTypes.SHOWMAN].name,
    technicianSkill: FighterTypeMeta[FighterTypes.TECHNICIAN].name,
    brawlerSkill: FighterTypeMeta[FighterTypes.BRAWLER].name
  };

  const skillTypeMap = {
    luchadorSkill: FighterTypes.LUCHADOR,
    dirtySkill: FighterTypes.DIRTY_PLAYER,
    powerhouseSkill: FighterTypes.POWERHOUSE,
    showmanSkill: FighterTypes.SHOWMAN,
    technicianSkill: FighterTypes.TECHNICIAN,
    brawlerSkill: FighterTypes.BRAWLER
  };

  const skillDescriptions = {
    powerhouseSkill: '+5% max Health per point',
    technicianSkill: '+5% max Stamina per point',
    luchadorSkill: '+2 Stamina regen per point (end of round)',
    showmanSkill: '+2 Health regen per point (end of round)',
    brawlerSkill: '+5% damage dealt per point',
    dirtySkill: '+5% pin chance per point'
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
    setCurrentRound(1);
    setMatchLog([]);
    setMatchWinner(null);
  };

  const startMatch = (selectedFighter) => {
  // Reset round-specific state
  setCurrentRound(1);
  setMatchLog([]);
  setMatchWinner(null);
  setAwaitingNextRound(false);
  setDrawnCards([]);
  setSelectedDiscards([]);

    // Create player fighter from skill points
    // Include generic wrestler image for player avatar
    const player = new Player(
      fighterName,
      skillPoints.luchadorSkill,
      skillPoints.dirtySkill,
      skillPoints.powerhouseSkill,
      skillPoints.showmanSkill,
      skillPoints.technicianSkill,
      skillPoints.brawlerSkill,
      100,
      100,
      0,
      GenericWrestlerImg
    );
    
    // Create opponent fighter
    // Preserve opponent's image by forwarding img as final constructor arg
    const opponent = new Player(
      selectedFighter.name,
      selectedFighter.luchadorSkill,
      selectedFighter.dirtySkill,
      selectedFighter.powerhouseSkill,
      selectedFighter.showmanSkill,
      selectedFighter.technicianSkill,
      selectedFighter.brawlerSkill,
      100,
      100,
      0,
      selectedFighter.img || null
    );
    
    setPlayerFighter(player);
    setCurrentFighter(opponent);
    
    // Initialize match
    initializeMatch(player, opponent, moves);
    
    // Start with move selection
    startRound(player, opponent);
  };

  const startRound = (player, opponent) => {
    // Draw cards for player
    const hand = handleMoveSelection(player);
    setDrawnCards(hand);
    setSelectedDiscards([]);
  setAwaitingNextRound(false);
    
    // Handle opponent selection automatically
    opponentMoveSelection(opponent);
    
    setCurrentScreen('cardSelect');
  };

  // Process a combat round with delayed event feed
  const executeRound = () => {
    if (!playerFighter || !currentFighter || isProcessingRound) return;
    const roundSnapshot = currentRound; // capture current round number
    setIsProcessingRound(true);
    let winnerFound = false;

    const delayMs = 1600;
    const logEvent = (ev) => {
      setMatchLog(prev => [...prev, ev]);
      setRenderTick(t => t + 1);
    };

    const declareWinner = (winner) => {
      if (winnerFound) return; // safeguard
      winnerFound = true;
      setMatchWinner(winner);
      if (winner === playerFighter) {
        const fighterIndex = wrestlers.findIndex(w => w.name === currentFighter.name);
        setDefeatedFighters(prev => [...prev, fighterIndex]);
        setTimeout(() => { setCurrentScreen('selectFighter'); }, 3000);
      } else {
        setTimeout(() => { setCurrentScreen('defeated'); }, 3000);
      }
    };

    // Build ordered action list dynamically based on who starts
    const playerFirst = roundSnapshot % 2 === 0; // even rounds player first
    const p = playerFighter;
    const o = currentFighter;

    const actions = [];

    const pushMove = (attacker, defender, move) => {
      if (!move) return; // safety
      actions.push(() => {
        const ev = executeMove(attacker, defender, move);
        logEvent(ev);
      });
    };

    const pushSpecialIfReady = (attacker, defender) => {
      actions.push(() => {
        if (attacker.momentum >= 100) {
          const special = getSpecialMove();
            const ev = executeMove(attacker, defender, special);
            attacker.momentum = 0; // reset after using
            logEvent(ev);
        }
      });
    };

    const pushPinfallAttempt = (attacker, defender, pinfallCardGetter) => {
      actions.push(() => {
        // Begin an asynchronous pinfall sequence with suspenseful count
        const pinfallCard = pinfallCardGetter();
        const result = attemptPinfall(attacker, defender, pinfallCard);

        // Flag to pause normal action progression until sequence finishes
        pinfallSequenceActive = true;

        const messages = [];
        messages.push({ type: 'pin-seq', attacker: attacker.name, text: 'Pinfall attempt!' });

        // Helper arrays for count text
        const countTexts = ['ONE...', 'TWO...', 'THREE!'];

        if (result.success) {
          // Successful pin: always show all three counts
            messages.push({ type: 'pin-seq', attacker: attacker.name, text: 'ONE...' });
            messages.push({ type: 'pin-seq', attacker: attacker.name, text: 'TWO...' });
            messages.push({ type: 'pin-seq', attacker: attacker.name, text: 'THREE!' });
        } else {
          // Unsuccessful: show counts reached (result.count is last successful count)
          for (let i = 0; i < result.count; i++) {
            messages.push({ type: 'pin-seq', attacker: attacker.name, text: countTexts[i] });
          }
        }

        // Final line depending on success / kickout
        if (result.success) {
          messages.push({ type: 'pin-seq', attacker: attacker.name, text: `The winner is ${attacker.name}!` });
        } else {
          messages.push({ type: 'pin-seq', attacker: attacker.name, text: 'Kickout! The match continues.' });
        }

        const perLineDelay = 850; // ms between referee counts

        messages.forEach((m, i) => {
          setTimeout(() => {
            logEvent(m);
            // After final message decide winner / continue round
            if (i === messages.length - 1) {
              if (result.success) {
                // Delay tiny bit to let final line render then declare winner
                setTimeout(() => {
                  declareWinner(attacker);
                  pinfallSequenceActive = false; // ensures runNext won't continue even though winnerFound stops flow
                  setIsProcessingRound(false); // finalize processing state
                }, 400);
              } else {
                // Resume normal action flow
                pinfallSequenceActive = false;
                // Only schedule continuation if match not ended meanwhile
                if (!winnerFound) {
                  setTimeout(runNext, delayMs);
                }
              }
            }
          }, i * perLineDelay);
        });
      });
    };

    if (playerFirst) {
      // Player-first sequence
      pushMove(p, o, p.hand[0]);
      pushMove(p, o, p.hand[1]);
      pushMove(o, p, o.hand[0]);
      pushMove(o, p, o.hand[1]);
      pushMove(p, o, p.hand[2]);
      pushSpecialIfReady(p, o);
      pushPinfallAttempt(p, o, () => p.currentPinfall);
      // Only proceed to opponent follow-ups if no winner
      pushMove(o, p, o.hand[2]);
      pushSpecialIfReady(o, p);
      pushPinfallAttempt(o, p, () => o.currentPinfall);
    } else {
      // Opponent-first sequence
      pushMove(o, p, o.hand[0]);
      pushMove(o, p, o.hand[1]);
      pushMove(p, o, p.hand[0]);
      pushMove(p, o, p.hand[1]);
      pushMove(o, p, o.hand[2]);
      pushSpecialIfReady(o, p);
      pushPinfallAttempt(o, p, () => o.currentPinfall);
      pushMove(p, o, p.hand[2]);
      pushSpecialIfReady(p, o);
      pushPinfallAttempt(p, o, () => p.currentPinfall);
    }

  let idx = 0;
  let pinfallSequenceActive = false; // gate to pause runNext while pinfall suspense plays
    const runNext = () => {
      if (idx >= actions.length || winnerFound) {
        // Round end handling if no winner
        if (!winnerFound) {
          restoreStaminaAndHealth(p, o);
          setCurrentRound(prev => prev + 1);
          if (roundSnapshot >= 5) {
            declareWinner(o); // draw -> loss for player
          } else {
            setAwaitingNextRound(true);
          }
        }
        setIsProcessingRound(false);
        return;
      }
      actions[idx]();
      idx += 1;
      // If a pinfall just ended the match, stop scheduling further actions
      if (winnerFound) {
        setIsProcessingRound(false);
        return;
      }
      // If a pinfall sequence started, its own timers will resume runNext.
      if (!pinfallSequenceActive) {
        setTimeout(runNext, delayMs);
      }
    };

    runNext();
  };

  const handleCardSelection = () => {
    if (selectedDiscards.length === 2) {
      // Finalize player hand
      finalizePlayerHand(playerFighter, drawnCards, selectedDiscards);
      
      // Move to combat phase
      setCurrentScreen('match');
      
  // Short delay then execute the combat round
  setTimeout(() => executeRound(), 500);
    }
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
                <React.Fragment key={skill}>
                <div className="flex items-start justify-between">
                  <span className="text-2xl text-white w-48">
                    {skillDisplayNames[skill]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => {
                        const type = skillTypeMap[skill];
                        const meta = FighterTypeMeta[type];
                        return (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full border-2 transition-colors ${
                              i < value
                                ? `${meta.dot}`
                                : 'bg-transparent border-gray-600'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <button
                      onClick={() => addSkillPoint(skill)}
                      disabled={remainingPoints === 0 || value === 7}
                      className={`text-4xl font-bold w-12 h-12 flex items-center justify-center rounded transition-colors ${
                        remainingPoints > 0 && value < 7
                          ? `${FighterTypeMeta[skillTypeMap[skill]].text} hover:bg-white/10`
                          : 'text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2 mb-2">{skillDescriptions[skill]}</div>
                </React.Fragment>
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
  <div key={renderTick} className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center px-8">
        <h1 className="text-5xl font-bold text-white mb-12">SELECT FIGHTER</h1>
        
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          {fighters.map((fighter, index) => {
      const isDefeated = defeatedFighters.includes(index);
      const specialtyName = getFighterSpecialty(fighter);
      const specialtyType = Object.values(FighterTypeMeta).find(m => m.name === specialtyName) || null;
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (!isDefeated) {
                    startMatch(fighter);
                  }
                }}
                disabled={isDefeated}
                  className={`relative w-48 h-56 border-2 ${specialtyType ? specialtyType.border : 'border-cyan-400'} rounded-lg flex flex-col items-center justify-start pt-2 gap-1 transition-all ${
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
                  <div className="text-center px-2 flex flex-col items-center">
                    {fighter.img ? (
                      <img src={fighter.img} alt={fighter.name} className="w-24 h-24 object-contain rounded-full border-2 border-white shadow mb-1" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-600 mb-1 border-2 border-white flex items-center justify-center text-white text-xs">No Image</div>
                    )}
                    <div className="text-white w-full">
                      <div className="font-bold text-sm leading-tight truncate" title={fighter.name}>
                        {fighter.name}
                      </div>
                      <div className={`text-xs font-semibold ${specialtyType ? specialtyType.text : 'text-cyan-300'}`}>
                        {specialtyName}
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

  // Match Screen
  if (currentScreen === 'match') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center px-8">
        <div className="flex items-center justify-center gap-12 mb-8">
          <div>
            <WrestlerSection fighter={playerFighter} />
          </div>
          <div className="text-5xl font-extrabold text-cyan-400 mx-8 select-none">
            VS
        {/* Round Info */}
        <div className="text-white text-2xl mb-4">Round {currentRound || 1}</div>
        
        {/* Match Status */}
        {matchWinner && (
          <div className="text-4xl font-bold text-cyan-400 mb-4">
            {matchWinner.name || 'Unknown'} WINS!
          </div>
        )}

        {/* Next Round Control */}
  {!matchWinner && awaitingNextRound && !isProcessingRound && (
          <button
            onClick={() => startRound(playerFighter, currentFighter)}
            className="mb-4 px-8 py-3 rounded-lg bg-cyan-400 text-gray-900 font-bold text-xl hover:bg-cyan-300 transition-colors"
          >
            Start Round {currentRound}
          </button>
        )}
          </div>
          <div>
            <WrestlerSection fighter={currentFighter} />
          </div>
        </div>
        
        
        <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-4 mt-2 shadow-lg">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Match Log</h2>
          <div ref={logContainerRef} className="h-40 overflow-y-auto bg-gray-800 rounded p-2 text-white text-base font-mono leading-snug">
            {matchLog.length === 0 ? (
              <div className="text-gray-500 italic">Match in progress...</div>
            ) : (
              matchLog.filter(Boolean).map((event, index) => (
                <div key={index} className="mb-1">
                  {event.type === 'move' && !event.failed && (
                    <span>
                      <span className="font-semibold text-white">{event.attacker || 'Unknown'}</span>
                      <span className="mx-1 text-gray-400">uses</span>
                      <span className="font-bold text-cyan-300">{event.move || 'Unknown Move'}</span>
                      {(event.damage || 0) > 0 && (
                        <span className="ml-2 text-red-400 font-extrabold">({event.damage} dmg)</span>
                      )}
                      {(event.heal || 0) > 0 && (
                        <span className="ml-2 text-green-400 font-bold">(+{event.heal})</span>
                      )}
                    </span>
                  )}
                  {event.type === 'move' && event.failed && (
                    <span className="text-yellow-400 font-semibold">
                      <span className="text-white font-bold">{event.attacker || 'Unknown'}</span> cannot use <span className="font-bold">{event.move || 'Unknown Move'}</span> - {event.reason || 'unknown reason'}
                    </span>
                  )}
                  {event.type === 'pinfall' && (
                    <span className={event.result?.success ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                      {event.attacker || 'Unknown'} pinfall attempt: {event.result?.success ? 'SUCCESS!' : `Count ${event.result?.count || 0}`}
                    </span>
                  )}
                  {event.type === 'pin-seq' && (
                    <span className="text-yellow-200 font-semibold tracking-wide">
                      {event.text}
                    </span>
                  )}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    );
  }

  // Discard Screen
  if (currentScreen === 'cardSelect') {
    // Show the 3 cards that were drawn from the deck and the pinfall card
    const pinfallCard = playerFighter?.currentPinfall || null;

    const handleToggleDiscard = (idx) => {
      if (selectedDiscards.includes(idx)) {
        setSelectedDiscards(selectedDiscards.filter(i => i !== idx));
      } else if (selectedDiscards.length < 2) {
        setSelectedDiscards([...selectedDiscards, idx]);
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
                {selectedDiscards.includes(idx) ? "Discarding" : "Keep"}
              </div>
            </div>
          ))}
          {pinfallCard && (
            <div>
              <MoveCard move={pinfallCard} />
              <div className="text-center mt-2 text-xs text-cyan-300 font-bold">Pinfall (Auto-Keep)</div>
            </div>
          )}
        </div>
        <button
          className={`px-8 py-3 rounded-lg text-xl font-bold transition-all ${
            selectedDiscards.length === 2
              ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-300'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={selectedDiscards.length !== 2}
          onClick={handleCardSelection}
        >
          Confirm Discards
        </button>
      </div>
    );
  }




  // Defeated Screen (full run reset requirement)
  if (currentScreen === 'defeated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-red-900 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white mb-4">DEFEATED</h1>
        <p className="text-2xl text-gray-300 mb-12">Your run has ended. Start a new gauntlet.</p>
        <button
          onClick={resetGame}
          className="px-12 py-4 bg-red-600 text-white font-bold text-xl rounded-lg hover:bg-red-500 shadow-lg"
        >
          New Run
        </button>
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