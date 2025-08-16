import FighterTypes from "../fighterTypes";
import Move from "./move";

// Each card will cost some amount of stamina
// Will deal some amount of damage.
// Some may heal.
// Some may add momentum directly.
// Some may restore stamina.
const moves = [
    //(id, name, type, baseStaminaCost ,baseDamage, baseMomentum, baseHeal)
    // Luchador Moves
    new Move(0, "Frog splash", FighterTypes.LUCHADOR, 20, 15, 14, 0),
    new Move(1, "Swanton Bomb", FighterTypes.LUCHADOR, 15, 12, 10, 0),
    new Move(2, "Dropkick", FighterTypes.LUCHADOR, 10, 8, 7, 0),
    new Move(3, "Elbow drop", FighterTypes.LUCHADOR, 25, 18, 16, 0),
    new Move(4, "Hurricanrana", FighterTypes.LUCHADOR, 30, 20, 20, 0),
    new Move(5, "Moonsault", FighterTypes.LUCHADOR, 35, 25, 24, 0),
    // Dirty Player Moves
    new Move(6, "Eye poke", FighterTypes.DIRTY_PLAYER, 5, 5, 5, 0),
    new Move(7, "Low blow", FighterTypes.DIRTY_PLAYER, 10, 12, 8, 0),
    new Move(8, "Chair shot", FighterTypes.DIRTY_PLAYER, 15, 20, 10, 0),
    new Move(9, "Taunt", FighterTypes.DIRTY_PLAYER, 0, 0, 15, 0),
    new Move(10, "Distract Ref", FighterTypes.DIRTY_PLAYER, -15, 0, 5, 0),
    new Move(11, "Insult Opponent", FighterTypes.DIRTY_PLAYER, -10, 5, 5, 0),
    // Powerhouse Moves
    new Move(12, "Chop", FighterTypes.POWERHOUSE, 15, 18, 8, 0),
    new Move(13, "Slam", FighterTypes.POWERHOUSE, 20, 22, 10, 0),
    new Move(14, "Suplex", FighterTypes.POWERHOUSE, 25, 25, 12, 0),
    new Move(15, "Spine buster", FighterTypes.POWERHOUSE, 30, 28, 15, 0),
    new Move(16, "Power bomb", FighterTypes.POWERHOUSE, 35, 35, 18, 0),
    new Move(17, "Samoan drop", FighterTypes.POWERHOUSE, 40, 40, 20, 0),
    // Showman Moves
    new Move(18, "Leg drop", FighterTypes.SHOWMAN, 20, 15, 12, 5),
    new Move(19, "Showoff", FighterTypes.SHOWMAN, 5, 0, 15, 10),
    new Move(20, "Strut and slap", FighterTypes.SHOWMAN, 10, 5, 20, 0),
    new Move(21, "Play to the crowd", FighterTypes.SHOWMAN, 10, 0, 10, 15),
    new Move(22, "The Swing", FighterTypes.SHOWMAN, 10, 5, 20, 0),
    new Move(23, "Mic Drop", FighterTypes.SHOWMAN, 15, 0, 25, 0),
    // Technician Moves
    new Move(24, "Boston crab", FighterTypes.TECHNICIAN, 25, 12, 8, 0),
    new Move(25, "Sleeper hold", FighterTypes.TECHNICIAN, -10, 5, 8, 0),
    new Move(26, "Arm breaker", FighterTypes.TECHNICIAN, 30, 15, 12, 0),
    new Move(27, "Figure four", FighterTypes.TECHNICIAN, 35, 18, 15, 0),
    new Move(28, "Ankle lock", FighterTypes.TECHNICIAN, 15, 10, 12, 0),
    new Move(29, "Kimura lock", FighterTypes.TECHNICIAN, 25, 15, 10, 0),
    // Brawler Moves
    new Move(30, "Closeline", FighterTypes.BRAWLER, 15, 20, 8, 0),
    new Move(31, "DDT", FighterTypes.BRAWLER, 20, 22, 10, 0),
    new Move(32, "Neck breaker", FighterTypes.BRAWLER, 25, 25, 12, 0),
    new Move(33, "Punch", FighterTypes.BRAWLER, 10, 15, 6, 0),
    new Move(34, "Running knee", FighterTypes.BRAWLER, 30, 28, 15, 0),
    new Move(35, "Super kick", FighterTypes.BRAWLER, 25, 30, 12, 0)
];

const pinfallMoves = [
    // Pinfall Moves
    new Move(0,"Flying Splash Pin",FighterTypes.LUCHADOR,0,0,0,0),
    new Move(1,"Dirty Pin",FighterTypes.DIRTY_PLAYER,0,0,0,0),
    new Move(2,"Power Slam Pin",FighterTypes.POWERHOUSE,0,0,0,0),
    new Move(3,"Showboat Pin",FighterTypes.SHOWMAN,0,0,0,0),
    new Move(4,"Technical Pin",FighterTypes.TECHNICIAN,0,0,0,0),
    new Move(5,"Brutal Pin",FighterTypes.BRAWLER,0,0,0,0),
]

const specialMoves = [
    new Move(0,"Jumping Cutter",FighterTypes.LUCHADOR,0,45,0,0),
    new Move(1,"Double Underhook Facebuster",FighterTypes.DIRTY_PLAYER,0,45,0,0),
    new Move(2,"Spear",FighterTypes.POWERHOUSE,0,45,0,0),
    new Move(3,"Piledriver",FighterTypes.SHOWMAN,0,45,0,15),
    new Move(4,"Fireman's Carry Slam",FighterTypes.TECHNICIAN,0,45,0,10),
    new Move(5,"Chokeslam",FighterTypes.BRAWLER,0,45,0,0),
]

export { moves , pinfallMoves , specialMoves};
