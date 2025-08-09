class Player{
    constructor(name, luchadorSkill, dirtySkill, powerhouseSkill, showmanSkill,
         technicianSkill, brawlerSkill, health = 100, stamina = 100, momentum = 0, img = null){
            this.name = name;
            this.luchadorSkill = luchadorSkill;
            this.dirtySkill = dirtySkill;
            this.powerhouseSkill = powerhouseSkill;
            this.showmanSkill = showmanSkill;
            this.technicianSkill = technicianSkill;
            this.brawlerSkill = brawlerSkill;
            this.health = health;
            this.stamina = stamina;
            this.momentum = momentum;
            this.hand = [];
            this.currentPinfall = 0;
            this.deck = [];
            this.pinfallDeck = [];
            this.img = img;
            this.discards = [];
        }
    getPlayerSkill(num) {
        const skills = [
            this.luchadorSkill,
            this.dirtySkill,
            this.powerhouseSkill,
            this.showmanSkill,
            this.technicianSkill,
            this.brawlerSkill
        ];
        return skills[num];
    }



}

export default Player;