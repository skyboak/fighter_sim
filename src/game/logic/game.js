
import { getMovesFromDeck ,getPinfall} from "./deck";
import FighterTypes from "../constants/fighterTypes";
import Player from "./player";
import { pinfallMoves } from "../constants/moves";

function handleMoveSelection(player, deck) {
    // pick from deck 3 cards . remove them from deck
    const hand = getMovesFromDeck(player.deck,3);
    player.currentPinfall = getPinfall(player.pinfallDeck);

    // discard 2 cards. remove them from deck. add 2 new from deck and remove them from deck
    console.log("pick 2 to discard");

    //USER INPUT

    //hand = discard2(hand,userDiscard1,userDiscard2);
    
    const newMoves = getMovesFromDeck(2); // get 2 new moves from the deck
    hand.push(...newMoves); // add them to the hand array
    
    player.hand = hand; // Assign the selected moves to the player's hand

    
}

function discard2(hand, index1, index2) {
    // Sort indexes descending so removing the first doesn't affect the second
    const [first, second] = [index1, index2].sort((a, b) => b - a);
    hand.splice(first, 1);
    hand.splice(second, 1);
    return hand;
}

function opponentMoveSelection(opp, deck) {
    const hand = getMovesFromDeck(3);
    opp.hand = hand;

    opp.currentPinfall = getPinfall();

}


function playRound(roundNum,player,opp){
    //
    if(roundNum % 2 === 1){
        executeMove(opp.hand[0]);
        executeMove(opp.hand[1]);
        executeMove(player.hand[0]);
        executeMove(player.hand[1]);
        executeMove(opp.hand[2]);
        //if mom ==100
        if(opp.momentum >= 100){
            executeMove() //specialmove
        }
        if(attemptPinfall(opp, player, opp.currentPinfall)) return opp;       //check if sucsess
        executeMove(player.hand[2]);
        attemptPinfall(player, opp, player.currentPinfall);
    }else{
        executeMove(player.hand[0]);
        executeMove(player.hand[1]); 
        executeMove(opp.hand[0]);
        executeMove(opp.hand[1]);
        executeMove(player.hand[2]);
        attemptPinfall(player, opp, player.currentPinfall);    
        executeMove(opp.hand[2]);
        attemptPinfall(opp, player, opp.currentPinfall);    
    }
    restoreStaminaAndHealth(player,opp)


}


// Executes a single move, checking stamina and applying effects
function executeMove(attacker, defender, move) {
    attacker.health = Math.min(attacker.health + move.baseHeal, 100);

    defender.health = Math.max(defender.health - move.baseDamage, 0);

    const momentumGain = move.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(move.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);

    attacker.stamina = Math.max(0, Math.min(attacker.stamina - move.baseStaminaCost, 100));

    console.log(move.name);
}


// Handles the pinfall attempt and returns whether it was successful
function attemptPinfall(attacker, defender, pinfall) {
    const momentumGain = pinfall.baseMomentum * (1 + (0.1 * attacker.getPlayerSkill(pinfall.type)));
    attacker.momentum = Math.min(attacker.momentum + momentumGain, 100);
    
    const skillBonus = 1 + (0.1 * attacker.getPlayerSkill(pinfall.type));
    const healthFactor = Math.max(0.1, 1 - defender.health / 100); // Lower health = higher chance
    const pinfallChance = skillBonus * healthFactor;

    const roll = Math.random();

    if (roll < pinfallChance) {
        return true; // Pinfall successful
    } else {
        return false; // Pinfall failed
    }


}


// Restores stamina to both fighters at the end of the round
function restoreStaminaAndHealth(player, opponent) {

    //lucha skill improves stamina regen. showman skill improves health regen.
    player.stamina = Math.min(player.stamina + (player.getPlayerSkill(0) * 2) + 40, 100);
    player.health = Math.min(player.health + (player.getPlayerSkill(3) * 2) + 10, 100);

    opponent.stamina = Math.min(opponent.stamina + (opponent.getPlayerSkill(0) * 2) + 40, 100); 
    opponent.health = Math.min(opponent.health + (opponent.getPlayerSkill(3) * 2) + 10, 100);
}


function startMatch(player, opponent, deck) {
    let roundNum = 1;
    let winner = null;

    player.deck = deck;
    opponent.deck = deck;
    player.pinfallDeck = pinfallMoves;
    opponent.pinfallDeck = pinfallMoves;

    // 4. Main game loop
    while (!winner || roundNum > 5) {
        handleMoveSelection(player,deck);
        opponentMoveSelection(opponent,deck);
        winner = playRound(roundNum, player, opponent);
        roundNum++;
    }
    console.log(`${winner.name} wins the match!`);
    return winner;
}