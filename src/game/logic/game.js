
import { getMovesFromDeck, getPinfall, getSpecialMove} from "./deck";
import FighterTypes from "../constants/fighterTypes";
import Player from "./player";
import { pinfallMoves } from "../constants/moves";

function handleMoveSelection(player) {
    // Get 3 moves from deck initially + 1 pinfall
    const hand = getMovesFromDeck(player.deck, 3);
    player.currentPinfall = getPinfall(player.pinfallDeck);
    
    // For now, simulate user input with random selection
    // TODO: Replace with actual user interface
    console.log("Pick 2 to discard:", hand.map((move, i) => `${i}: ${move.name}`));
    
    // Temporary: random discard for testing (replace with user input)
    const userDiscard1 = Math.floor(Math.random() * hand.length);
    let userDiscard2 = Math.floor(Math.random() * hand.length);
    while (userDiscard2 === userDiscard1) {
        userDiscard2 = Math.floor(Math.random() * hand.length);
    }
    
    // Remove the 2 discarded cards
    const updatedHand = discard2(hand, userDiscard1, userDiscard2);
    
    // Get 2 new moves from deck to replace discarded ones
    const newMoves = getMovesFromDeck(player.deck, 2);
    updatedHand.push(...newMoves);
    
    // Player should end up with exactly 3 moves + 1 pinfall
    player.hand = updatedHand;
    
    console.log("Final hand:", player.hand.map(move => move.name));
    console.log("Pinfall:", player.currentPinfall.name);
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

function opponentMoveSelection(opp) {
    const hand = getMovesFromDeck(opp.deck, 3);
    opp.hand = hand;
    opp.currentPinfall = getPinfall(opp.pinfallDeck);
}


function playRound(roundNum, player, opp) {
    if (roundNum % 2 === 1) {
        // Odd round: Opponent goes first
        executeMove(opp, player, opp.hand[0]);
        executeMove(opp, player, opp.hand[1]);
        executeMove(player, opp, player.hand[0]);
        executeMove(player, opp, player.hand[1]);
        executeMove(opp, player, opp.hand[2]);
        
        // Check for opponent special move before pinfall
        if (opp.momentum >= 100) {
            executeMove(opp, player, getSpecialMove()); // Execute opponent's special move
            opp.momentum = 0; // Deplete momentum bar
        }
        
        // Opponent pinfall attempt
        const oppPinfallResult = attemptPinfall(opp, player, opp.currentPinfall);
        if (oppPinfallResult.success) return opp; // Opponent wins
        
        executeMove(player, opp, player.hand[2]);
        
        // Check for player special move before pinfall
        if (player.momentum >= 100) {
            executeMove(player, opp, getSpecialMove()); // Execute player's special move
            player.momentum = 0; // Deplete momentum bar
        }
        
        // Player pinfall attempt
        const playerPinfallResult = attemptPinfall(player, opp, player.currentPinfall);
        if (playerPinfallResult.success) return player; // Player wins
        
    } else {
        // Even round: Player goes first
        executeMove(player, opp, player.hand[0]);
        executeMove(player, opp, player.hand[1]);
        executeMove(opp, player, opp.hand[0]);
        executeMove(opp, player, opp.hand[1]);
        executeMove(player, opp, player.hand[2]);
        
        // Check for player special move before pinfall
        if (player.momentum >= 100) {
            executeMove(player, opp, getSpecialMove()); // Execute player's special move
            player.momentum = 0; // Deplete momentum bar
        }
        
        // Player pinfall attempt
        const playerPinfallResult = attemptPinfall(player, opp, player.currentPinfall);
        if (playerPinfallResult.success) return player; // Player wins
        
        executeMove(opp, player, opp.hand[2]);
        
        // Check for opponent special move before pinfall
        if (opp.momentum >= 100) {
            executeMove(opp, player, getSpecialMove()); // Execute opponent's special move
            opp.momentum = 0; // Deplete momentum bar
        }
        
        // Opponent pinfall attempt
        const oppPinfallResult = attemptPinfall(opp, player, opp.currentPinfall);
        if (oppPinfallResult.success) return opp; // Opponent wins
    }
    

    // Return null if no winner this round
    return null;
}


// Executes a single move, checking stamina and applying effects
function executeMove(attacker, defender, move) {

    if (attacker.stamina < move.baseStaminaCost) {
        console.log(`${attacker.name} doesn't have enough stamina for ${move.name}`);
        return; // Skip the move Not enough stamina.
    }

    attacker.health = Math.min(attacker.health + move.baseHeal, 100);

    defender.health = Math.max(defender.health - move.baseDamage, 0);

    const momentumGain = move.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(move.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);

    attacker.stamina = Math.max(0, Math.min(attacker.stamina - move.baseStaminaCost, 100));

    console.log(move.name);
}


function attemptPinfall(attacker, defender, pinfall) {
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
function restoreStaminaAndHealth(player, opponent) {

    //lucha skill improves stamina regen. showman skill improves health regen.
    player.stamina = Math.min(player.stamina + (player.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, 100);
    player.health = Math.min(player.health + (player.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, 100);

    opponent.stamina = Math.min(opponent.stamina + (opponent.getPlayerSkill(FighterTypes.LUCHADOR) * 2) + 40, 100); 
    opponent.health = Math.min(opponent.health + (opponent.getPlayerSkill(FighterTypes.SHOWMAN) * 2) + 10, 100);
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
        winner = playRound(roundNum, player, opponent);
        restoreStaminaAndHealth(player, opponent);
        roundNum++;
    }
    console.log(`${winner.name} wins the match!`);
    return winner;
}