const FighterTypes = {
    LUCHADOR: 0,
    DIRTY_PLAYER: 1,
    POWERHOUSE: 2,
    SHOWMAN: 3,
    TECHNICIAN: 4,
    BRAWLER: 5
};

// Metadata for displaying fighter type names and colors in the UI
// Tailwind color classes chosen for distinct visual differentiation.
// You can tweak these if you prefer different palette choices.
export const FighterTypeMeta = {
    [FighterTypes.LUCHADOR]: {
        name: 'Luchador',
    badge: 'bg-purple-700 text-purple-100',
    border: 'border-purple-400',
    dot: 'bg-purple-500 border-purple-400',
    text: 'text-purple-300'
    },
    [FighterTypes.DIRTY_PLAYER]: {
        name: 'Dirty',
    badge: 'bg-yellow-700 text-yellow-100',
    border: 'border-yellow-400',
    dot: 'bg-yellow-500 border-yellow-400',
    text: 'text-yellow-300'
    },
    [FighterTypes.POWERHOUSE]: {
        name: 'Powerhouse',
    badge: 'bg-red-700 text-red-100',
    border: 'border-red-500',
    dot: 'bg-red-600 border-red-500',
    text: 'text-red-300'
    },
    [FighterTypes.SHOWMAN]: {
        name: 'Showman',
    badge: 'bg-pink-700 text-pink-100',
    border: 'border-pink-500',
    dot: 'bg-pink-500 border-pink-400',
    text: 'text-pink-300'
    },
    [FighterTypes.TECHNICIAN]: {
        name: 'Technician',
    badge: 'bg-blue-700 text-blue-100',
    border: 'border-blue-400',
    dot: 'bg-blue-500 border-blue-400',
    text: 'text-blue-300'
    },
    [FighterTypes.BRAWLER]: {
        name: 'Brawler',
    badge: 'bg-orange-700 text-orange-100',
    border: 'border-orange-500',
    dot: 'bg-orange-500 border-orange-400',
    text: 'text-orange-300'
    }
};

export default FighterTypes;

