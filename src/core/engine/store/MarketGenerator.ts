import Buff from "../buffs/Buff";

function getBuff(buffs: Buff[]) {
    const prob = {
        0: 70,
        1: 20,
        2: 10
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

    while (true) {

        let shuffled = buffs.reverse().sort(() => Math.random() - 0.5);

        const buff = getBuff(shuffled);

        if (buff.isCompatible(sorted)) {
            console.log(`${buff.targets} MATCHES ${sorted}`);
            sorted.push(buff);
        }


        if (sorted.length == 3) {
            console.log("DONE");
            break;
        }
    }

    return sorted;


}

export {
    getBuffMarket
}