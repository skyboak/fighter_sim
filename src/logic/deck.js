import { specialMoves } from "../constants/moves";


// Function to get a random move card from the deck
function getMove(deck){
    const randomIndex = Math.floor(Math.random() * deck.length);
    const move = deck[randomIndex];
    deck.splice(randomIndex, 1); // Remove the move from the deck
    return move;
}

function getMovesFromDeck(deck,moveCount) {
    const selectedMoves = [];
    for (let i = 0; i < moveCount ; i++) {
        const move = getMove(deck);
        if (move) {
            selectedMoves.push(move);
        } else {
            break; // Stop if there are no more moves in the deck
        }
    }
    return  selectedMoves;
}

function getPinfall(pinfallDeck){
    const randomIndex = Math.floor(Math.random() * pinfallDeck.length);
    const move = pinfallDeck[randomIndex];
    pinfallDeck.splice(randomIndex, 1);
    return move;
}

function getSpecialMove(){
    const randomIndex = Math.floor(Math.random() * specialMoves.length);
    const move = specialMoves[randomIndex];
    return move;
}


export { getSpecialMove, getPinfall, getMove, getMovesFromDeck };
