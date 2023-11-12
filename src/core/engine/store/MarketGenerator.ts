import GameSettings from "../GameSettings";
import Buff from "../buffs/Buff";

function getBuff(buffs: Buff[]) {
    const prob = {
        0: 60,
        1: 25,
        2: 15
    }

    const cumulativeProb: number[] = [];
    let cumulative = 0;

    for (const rarity in prob) {
        cumulative += prob[rarity];
        cumulativeProb.push(cumulative);
    }

    const randomNum = Math.random() * 100;

    let selectedRarity = 0;
    for (let i = 0; i < cumulativeProb.length; i++) {
        if (randomNum < cumulativeProb[i]) {
            selectedRarity = i;
            break;
        }
    }

    const availableBuffs = buffs.filter(buff => buff.rarity === selectedRarity);

    const sortedBuff = availableBuffs[Math.floor(Math.random() * availableBuffs.length)];

    return sortedBuff;
}

function getBuffMarket(buffs: Buff[]) {


    let sorted: Buff[] = [];

    for(let i = 0; i <= GameSettings.buffsPerRoll; i++) {

        let shuffled = buffs.reverse().sort(() => Math.random() - 0.5);

        const buff = getBuff(shuffled);

        sorted.push(buff);
    }

    return sorted;


}

export {
    getBuffMarket
}