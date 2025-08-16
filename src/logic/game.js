
import { getMovesFromDeck, getPinfall, getSpecialMove} from "./deck";
import FighterTypes from "../fighterTypes";
import { pinfallMoves } from "../constants/moves";

export function handleMoveSelection(player) {
    // Get 3 moves from deck initially + 1 pinfall
    const hand = getMovesFromDeck(player.deck, 3);
    player.currentPinfall = getPinfall(player.pinfallDeck);
    
    // Return the hand for UI to handle selection
    return hand;
}

function discard2(hand, index1, index2) {
    // Create a copy to avoid mutating the original
    const newHand = [...hand];
    
    // Sort indexes descending so removing the first doesn't affect the second
    const [first, second] = [index1, index2].sort((a, b) => b - a);
    newHand.splice(first, 1);
    newHand.splice(second, 1);
    
    return newHand;
}

export function finalizePlayerHand(player, hand, discardIndexes) {
    // Remove the 2 discarded cards
    const updatedHand = discard2(hand, discardIndexes[0], discardIndexes[1]);
    
    // Get 2 new moves from deck to replace discarded ones
    const newMoves = getMovesFromDeck(player.deck, 2);
    updatedHand.push(...newMoves);
    
    // Player should end up with exactly 3 moves + 1 pinfall
    player.hand = updatedHand;
    
    // console.log("Final hand:", player.hand.map(move => move.name));
    // console.log("Pinfall:", player.currentPinfall.name);
}

export function opponentMoveSelection(opp) {
    const hand = getMovesFromDeck(opp.deck, 3);
    opp.hand = hand;
    opp.currentPinfall = getPinfall(opp.pinfallDeck);
}


export function playRound(roundNum, player, opp) {
    const events = []; // Track events for UI display
    
    if (roundNum % 2 === 1) {
        // Odd round: Opponent goes first
        events.push(executeMove(opp, player, opp.hand[0]));
        events.push(executeMove(opp, player, opp.hand[1]));
        events.push(executeMove(player, opp, player.hand[0]));
        events.push(executeMove(player, opp, player.hand[1]));
        events.push(executeMove(opp, player, opp.hand[2]));
        
        // Check for opponent special move before pinfall
        if (opp.momentum >= 100) {
            events.push(executeMove(opp, player, getSpecialMove())); // Execute opponent's special move
            opp.momentum = 0; // Deplete momentum bar
        }
        
        // Opponent pinfall attempt
        const oppPinfallResult = attemptPinfall(opp, player, opp.currentPinfall);
        events.push({ type: 'pinfall', attacker: opp.name, result: oppPinfallResult });
        if (oppPinfallResult.success) return { winner: opp, events }; // Opponent wins
        
        events.push(executeMove(player, opp, player.hand[2]));
        
        // Check for player special move before pinfall
        if (player.momentum >= 100) {
            events.push(executeMove(player, opp, getSpecialMove())); // Execute player's special move
            player.momentum = 0; // Deplete momentum bar
        }
        
        // Player pinfall attempt
        const playerPinfallResult = attemptPinfall(player, opp, player.currentPinfall);
        events.push({ type: 'pinfall', attacker: player.name, result: playerPinfallResult });
        if (playerPinfallResult.success) return { winner: player, events }; // Player wins
        
    } else {
        // Even round: Player goes first
        events.push(executeMove(player, opp, player.hand[0]));
        events.push(executeMove(player, opp, player.hand[1]));
        events.push(executeMove(opp, player, opp.hand[0]));
        events.push(executeMove(opp, player, opp.hand[1]));
        events.push(executeMove(player, opp, player.hand[2]));
        
        // Check for player special move before pinfall
        if (player.momentum >= 100) {
            events.push(executeMove(player, opp, getSpecialMove())); // Execute player's special move
            player.momentum = 0; // Deplete momentum bar
        }
        
        // Player pinfall attempt
        const playerPinfallResult = attemptPinfall(player, opp, player.currentPinfall);
        events.push({ type: 'pinfall', attacker: player.name, result: playerPinfallResult });
        if (playerPinfallResult.success) return { winner: player, events }; // Player wins
        
        events.push(executeMove(opp, player, opp.hand[2]));
        
        // Check for opponent special move before pinfall
        if (opp.momentum >= 100) {
            events.push(executeMove(opp, player, getSpecialMove())); // Execute opponent's special move
            opp.momentum = 0; // Deplete momentum bar
        }
        
        // Opponent pinfall attempt
        const oppPinfallResult = attemptPinfall(opp, player, opp.currentPinfall);
        events.push({ type: 'pinfall', attacker: opp.name, result: oppPinfallResult });
        if (oppPinfallResult.success) return { winner: opp, events }; // Opponent wins
    }
    

    // Return events if no winner this round
    return { winner: null, events };
}


// Executes a single move, checking stamina and applying effects
export function executeMove(attacker, defender, move) {

    if (attacker.stamina < move.baseStaminaCost) {
        console.log(`${attacker.name} doesn't have enough stamina for ${move.name}`);
        return { type: 'move', attacker: attacker.name, move: move.name, failed: true, reason: 'insufficient stamina' };
    }

    // Dynamic caps
    const atkMaxHealth = attacker.getMaxHealth ? attacker.getMaxHealth() : 100;
    const atkMaxStamina = attacker.getMaxStamina ? attacker.getMaxStamina() : 100;

    // Damage multiplier: base * (1 + 5% per brawlerSkill) when using Brawler moves OR universal? design: damage multiplier from Brawler stat for all offense
    const brawlerMult = 1 + 0.05 * (attacker.brawlerSkill || 0);
    const damageDealt = Math.round(move.baseDamage * brawlerMult);

    attacker.health = Math.min(attacker.health + move.baseHeal, atkMaxHealth);
    defender.health = Math.max(defender.health - damageDealt, 0);

    const momentumGain = move.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(move.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);

    // Negative cost represents a gain (handled by subtraction operation already in original design)
    const staminaChange = -move.baseStaminaCost; // positive means gain, negative means loss
    attacker.stamina = Math.max(0, Math.min(attacker.stamina + staminaChange, atkMaxStamina));

    // console.log(move.name);
    
    return { 
        type: 'move', 
        attacker: attacker.name, 
        defender: defender.name,
        move: move.name, 
    damage: damageDealt,
        heal: move.baseHeal,
        momentum: momentumGain, // kept for compatibility
        momentumGain,
        staminaChange,
        failed: false 
    };
}


export function attemptPinfall(attacker, defender, pinfall) {
    // Removed momentum gain from pinfall per design change
    const skillBonus = 1 + (0.1 * attacker.getPlayerSkill(pinfall.type));
    const healthFactor = Math.max(0.1, 1 - defender.health / 100); // Lower health = higher chance

    // Dirty Player passive: improves pinfall odds regardless of pinfall card type.
    // Scaling: +5% to overall chance per Dirty skill point (max +40% at 8).
    // Using getPlayerSkill for consistency with other skill fetches.
    const dirtySkill = attacker.getPlayerSkill(FighterTypes.DIRTY_PLAYER) || 0;
    const dirtyFactor = 1 + dirtySkill * 0.05;

    // Low-health / zero-health bonus: up to +0.5 when at 0–20 HP, plus an extra +0.3 if exactly 0.
    const lowHealthBoost = defender.health <= 20 ? ((20 - defender.health) / 20) * 0.5 : 0; // 0..0.5
    const zeroHealthBonus = defender.health === 0 ? 0.3 : 0; // explicit extra incentive at 0

    // New base chance slightly higher, additive bonuses applied after multiplicative factors.
    const baseChance = (skillBonus * healthFactor * dirtyFactor) + lowHealthBoost + zeroHealthBonus;

    // Raised caps & multipliers to make pinfalls slightly easier overall.
    const count1Chance = Math.min(0.95, baseChance * 0.9);
    if (Math.random() >= count1Chance) {
        return { success: false, count: 0 };
    }

    const count2Chance = Math.min(0.8, baseChance * 0.7);
    if (Math.random() >= count2Chance) {
        return { success: false, count: 1 };
    }

    const count3Chance = Math.min(0.65, baseChance * 0.55);
    if (Math.random() >= count3Chance) {
        return { success: false, count: 2 };
    }

    return { success: true, count: 3 };
}


// Restores stamina to both fighters at the end of the round
export function restoreStaminaAndHealth(player, opponent) {

    //lucha skill improves stamina regen. showman skill improves health regen.
    const pMaxStam = player.getMaxStamina ? player.getMaxStamina() : 100;
    const pMaxHp = player.getMaxHealth ? player.getMaxHealth() : 100;
    const oMaxStam = opponent.getMaxStamina ? opponent.getMaxStamina() : 100;
    const oMaxHp = opponent.getMaxHealth ? opponent.getMaxHealth() : 100;

    player.stamina = Math.min(player.stamina + (player.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, pMaxStam);
    player.health = Math.min(player.health + (player.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, pMaxHp);

    opponent.stamina = Math.min(opponent.stamina + (opponent.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, oMaxStam); 
    opponent.health = Math.min(opponent.health + (opponent.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, oMaxHp);
}

export function initializeMatch(player, opponent, deck) {
    player.deck = [...deck]; // Create a copy of the deck
    opponent.deck = [...deck]; // Create a copy of the deck
    player.pinfallDeck = [...pinfallMoves]; // Create a copy
    opponent.pinfallDeck = [...pinfallMoves]; // Create a copy
    
    // Reset fighter stats
    player.health = 100;
    player.stamina = 100;
    player.momentum = 0;
    opponent.health = 100;
    opponent.stamina = 100;
    opponent.momentum = 0;
}

// startMatch function not used in UI flow; removed to clean warnings.