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
    new Move(0,moveNames[0],FighterTypes.LUCHADOR,20,15,10,0),
    new Move(1,moveNames[1],FighterTypes.LUCHADOR,15,12,8,0),
    new Move(2,moveNames[2],FighterTypes.LUCHADOR,10,8,6,0),
    new Move(3,moveNames[3],FighterTypes.LUCHADOR,25,18,12,0),
    new Move(4,moveNames[4],FighterTypes.LUCHADOR,30,20,15,0),
    new Move(5,moveNames[5],FighterTypes.LUCHADOR,35,25,18,0),
    // Dirty Player Moves
    new Move(6,moveNames[6],FighterTypes.DIRTY_PLAYER,5,5,5,0),
    new Move(7,moveNames[7],FighterTypes.DIRTY_PLAYER,10,12,8,0),
    new Move(8,moveNames[8],FighterTypes.DIRTY_PLAYER,15,20,10,0),
    new Move(9,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,8,0),
    new Move(10,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,8,0),
    new Move(11,moveNames[9],FighterTypes.DIRTY_PLAYER,0,0,8,0),

    // Powerhouse Moves
    new Move(12,moveNames[10],FighterTypes.POWERHOUSE,15,18,8,0),
    new Move(13,moveNames[11],FighterTypes.POWERHOUSE,20,22,10,0),
    new Move(14,moveNames[12],FighterTypes.POWERHOUSE,25,25,12,0),
    new Move(15,moveNames[13],FighterTypes.POWERHOUSE,30,28,15,0),
    new Move(16,moveNames[14],FighterTypes.POWERHOUSE,35,35,18,0),
    new Move(17,moveNames[15],FighterTypes.POWERHOUSE,40,40,20,0),

    // Showman Moves
    new Move(18,moveNames[16],FighterTypes.SHOWMAN,20,15,12,5),
    new Move(19,moveNames[17],FighterTypes.SHOWMAN,5,0,15,10),
    new Move(20,moveNames[18],FighterTypes.SHOWMAN,10,5,20,0),
    new Move(21,moveNames[18],FighterTypes.SHOWMAN,10,5,20,0),
    new Move(22,moveNames[18],FighterTypes.SHOWMAN,10,5,20,0),
    new Move(23,moveNames[18],FighterTypes.SHOWMAN,10,5,20,0),

    // Technician Moves
    new Move(24,moveNames[19],FighterTypes.TECHNICIAN,25,12,8,0),
    new Move(25,moveNames[20],FighterTypes.TECHNICIAN,20,10,10,5),
    new Move(26,moveNames[21],FighterTypes.TECHNICIAN,30,15,12,0),
    new Move(27,moveNames[22],FighterTypes.TECHNICIAN,35,18,15,0),
    new Move(28,moveNames[23],FighterTypes.TECHNICIAN,15,8,12,8),
    new Move(29,moveNames[24],FighterTypes.TECHNICIAN,25,15,10,0),   

    // Brawler Moves
    new Move(30,moveNames[25],FighterTypes.BRAWLER,15,20,8,0),
    new Move(31,moveNames[26],FighterTypes.BRAWLER,20,22,10,0),
    new Move(32,moveNames[27],FighterTypes.BRAWLER,25,25,12,0),
    new Move(33,moveNames[28],FighterTypes.BRAWLER,10,15,6,0),
    new Move(34,moveNames[29],FighterTypes.BRAWLER,30,28,15,0),
    new Move(35,moveNames[30],FighterTypes.BRAWLER,25,30,12,0)   
];

const pinfallMoves = [
    // Pinfall Moves
    new Move(0,"Flying Splash Pin",FighterTypes.LUCHADOR,15,0,15,0),
    new Move(1,"Dirty Pin",FighterTypes.DIRTY_PLAYER,10,0,12,0),
    new Move(2,"Power Slam Pin",FighterTypes.POWERHOUSE,20,0,20,0),
    new Move(3,"Showboat Pin",FighterTypes.SHOWMAN,12,0,18,5),
    new Move(4,"Technical Pin",FighterTypes.TECHNICIAN,18,0,15,0),
    new Move(5,"Brutal Pin",FighterTypes.BRAWLER,15,0,15,0),
]

const specialMoves = [
    new Move(0,"High Flying Finisher",FighterTypes.LUCHADOR,50,40,0,0),
    new Move(1,"Underhanded Finish",FighterTypes.DIRTY_PLAYER,30,35,0,0),
    new Move(2,"Devastating Slam",FighterTypes.POWERHOUSE,60,50,0,0),
    new Move(3,"Spectacular Finish",FighterTypes.SHOWMAN,40,30,0,15),
    new Move(4,"Perfect Hold",FighterTypes.TECHNICIAN,45,35,0,10),
    new Move(5,"Knockout Blow",FighterTypes.BRAWLER,50,45,0,0),
]

export { moves , pinfallMoves , specialMoves};
