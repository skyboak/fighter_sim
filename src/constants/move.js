class Move{
    constructor(id, name, type, baseStaminaCost ,baseDamage, baseMomentum, baseHeal) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.baseStaminaCost = baseStaminaCost;
        this.baseDamage = baseDamage;
        this.baseMomentum = baseMomentum;
        this.baseHeal = baseHeal;
    }
}


export default Move;