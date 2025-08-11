
import { getMovesFromDeck, getPinfall, getSpecialMove} from "./deck";
import FighterTypes from "../constants/fighterTypes";
import Player from "./player";
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

    attacker.health = Math.min(attacker.health + move.baseHeal, 100);

    defender.health = Math.max(defender.health - move.baseDamage, 0);

    const momentumGain = move.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(move.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);

    attacker.stamina = Math.max(0, Math.min(attacker.stamina - move.baseStaminaCost, 100));

    // console.log(move.name);
    
    return { 
        type: 'move', 
        attacker: attacker.name, 
        defender: defender.name,
        move: move.name, 
        damage: move.baseDamage,
        heal: move.baseHeal,
        momentum: momentumGain,
        failed: false 
    };
}


export function attemptPinfall(attacker, defender, pinfall) {
    const momentumGain = pinfall.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(pinfall.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);
    
    const skillBonus = 1 + (0.1 * attacker.getPlayerSkill(pinfall.type));
    const healthFactor = Math.max(0.1, 1 - defender.health / 100); // Lower health = higher chance
    const baseChance = skillBonus * healthFactor;
    
    const count1Chance = Math.min(0.9, baseChance * 0.8);
    if (Math.random() >= count1Chance) {
        return { success: false, count: 0 };
    }
    
    const count2Chance = Math.min(0.7, baseChance * 0.6);
    if (Math.random() >= count2Chance) {
        return { success: false, count: 1 };
    }
    
    const count3Chance = Math.min(0.5, baseChance * 0.4);
    if (Math.random() >= count3Chance) {
        return { success: false, count: 2 };
    }
    
    return { success: true, count: 3 };
}


// Restores stamina to both fighters at the end of the round
export function restoreStaminaAndHealth(player, opponent) {

    //lucha skill improves stamina regen. showman skill improves health regen.
    player.stamina = Math.min(player.stamina + (player.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, 100);
    player.health = Math.min(player.health + (player.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, 100);

    opponent.stamina = Math.min(opponent.stamina + (opponent.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, 100); 
    opponent.health = Math.min(opponent.health + (opponent.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, 100);
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

function startMatch(player, opponent, deck) {
    let roundNum = 1;
    let winner = null;

    player.deck = deck;
    opponent.deck = deck;
    player.pinfallDeck = pinfallMoves;
    opponent.pinfallDeck = pinfallMoves;

    while (!winner && roundNum <= 5) {
        handleMoveSelection(player);
        opponentMoveSelection(opponent);
        const result = playRound(roundNum, player, opponent);
        winner = result.winner;
        restoreStaminaAndHealth(player, opponent);
        roundNum++;
    }
    console.log('${winner.name} wins the match!');
    return winner;
}