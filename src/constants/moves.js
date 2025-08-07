import FighterTypes from "./fighterTypes";
import Move from "./move";

// Each card will cost some amount of stamina
// Will deal some amount of damage.
// Some may heal.
// Some may add momentum directly.
// Some may restore stamina.
const moveNames = [
    "Frog splash",
    "Bionic elbow",
    "Dripkick",
    "Elbow drop",
    "Hurricanrana",
    "Moonsualt",

    "Eye poke",
    "Low blow",
    "Chair shot",
    "Taunt",

    "Chop",
    "Slam",
    "Suplex",
    "Spine buster",
    "Power bomb",
    "Samoan drop",

    "Leg drop",
    "Showoff",
    "Strut and slap",

    "Boston crab",
    "Sleeper hold",
    "Arm breaker",
    "Figure four",

    "Closeline",
    "DDT",
    "Neck breaker",
    "Punch",
    "Running knee",
    "Super kick"
];

const moves = [

    // Luchador Moves
    new Move(0,moveNames[0],FighterTypes.LUCHADOR,0,0,0),
    new Move(1,moveNames[1],FighterTypes.LUCHADOR,0,0,0),
    new Move(2,moveNames[2],FighterTypes.LUCHADOR,0,0,0),
    new Move(3,moveNames[3],FighterTypes.LUCHADOR,0,0,0),
    new Move(4,moveNames[4],FighterTypes.LUCHADOR,0,0,0),
    new Move(5,moveNames[5],FighterTypes.LUCHADOR,0,0,0),
    // Dirty Player Moves
    new Move(6,moveNames[6],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(7,moveNames[7],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(8,moveNames[8],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(9,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(10,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(11,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,0),

    // Powerhouse Moves
    new Move(12,moveNames[10],FighterTypes.POWERHOUSE,0,0,0),
    new Move(13,moveNames[11],FighterTypes.POWERHOUSE,0,0,0),
    new Move(14,moveNames[12],FighterTypes.POWERHOUSE,0,0,0),
    new Move(15,moveNames[13],FighterTypes.POWERHOUSE,0,0,0),
    new Move(16,moveNames[14],FighterTypes.POWERHOUSE,0,0,0),
    new Move(17,moveNames[15],FighterTypes.POWERHOUSE,0,0,0),

    // Showman Moves
    new Move(18,moveNames[16],FighterTypes.SHOWMAN,0,0,0),
    new Move(19,moveNames[17],FighterTypes.SHOWMAN,0,0,0),
    new Move(20,moveNames[18],FighterTypes.SHOWMAN,0,0,0),
    new Move(21,moveNames[18],FighterTypes.SHOWMAN,0,0,0),
    new Move(22,moveNames[18],FighterTypes.SHOWMAN,0,0,0),
    new Move(23,moveNames[18],FighterTypes.SHOWMAN,0,0,0),

    // Technician Moves
    new Move(24,moveNames[19],FighterTypes.TECHNICIAN,0,0,0),
    new Move(25,moveNames[20],FighterTypes.TECHNICIAN,0,0,0),
    new Move(26,moveNames[21],FighterTypes.TECHNICIAN,0,0,0),
    new Move(27,moveNames[22],FighterTypes.TECHNICIAN,0,0,0),
    new Move(28,moveNames[23],FighterTypes.TECHNICIAN,0,0,0),
    new Move(29,moveNames[24],FighterTypes.TECHNICIAN,0,0,0),   

    // Brawler Moves
    new Move(30,moveNames[25],FighterTypes.BRAWLER,0,0,0),
    new Move(31,moveNames[26],FighterTypes.BRAWLER,0,0,0),
    new Move(32,moveNames[27],FighterTypes.BRAWLER,0,0,0),
    new Move(33,moveNames[28],FighterTypes.BRAWLER,0,0,0),
    new Move(34,moveNames[29],FighterTypes.BRAWLER,0,0,0),
    new Move(35,moveNames[30],FighterTypes.BRAWLER,0,0,0)   
];

const pinfallMoves = [
    // Pinfall Moves
    new Move(0,moveNames[0],FighterTypes.LUCHADOR,0,0,0),
    new Move(1,moveNames[1],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(2,moveNames[2],FighterTypes.POWERHOUSE,0,0,0),
    new Move(3,moveNames[3],FighterTypes.SHOWMAN,0,0,0),
    new Move(4,moveNames[4],FighterTypes.TECHNICIAN,0,0,0),
    new Move(5,moveNames[5],FighterTypes.BRAWLER,0,0,0),
]

const specialMoves = [
    new Move(0,moveNames[0],FighterTypes.LUCHADOR,0,0,0),
    new Move(1,moveNames[1],FighterTypes.DIRTY_PLAYER,0,0,0),
    new Move(2,moveNames[2],FighterTypes.POWERHOUSE,0,0,0),
    new Move(3,moveNames[3],FighterTypes.SHOWMAN,0,0,0),
    new Move(4,moveNames[4],FighterTypes.TECHNICIAN,0,0,0),
    new Move(5,moveNames[5],FighterTypes.BRAWLER,0,0,0),
]

export { moves , pinfallMoves , specialMoves};
