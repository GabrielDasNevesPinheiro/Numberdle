// All buffs are implemented staticly in the array.
// when a player rolls his store, code will sort the buffs by the array.

import { Playing } from "../Playing";
import Buff from "../buffs/Buff";
import { Attributes } from "../enum/Attributes";
import { Rarity } from "../enum/Rarity";

export const BuffMarket = [

    new Buff({
        name: "Benção do Trapaceiro",
        price: 200,
        rarity: Rarity.NORMAL,
        description: "Ao iniciar o jogo, te direi se o número é maior ou menor que 500",
        targets: [Attributes.TIP_TIME, Attributes.TIP_TYPE],

        apply: (userId: string) => {

            const { generatedNumber } = Playing.inGame[userId];

            Playing.inGame[userId].playerEngine.tip_attempt = 10;
            Playing.inGame[userId].playerEngine.wrap_default_tip = true;
            Playing.inGame[userId].playerEngine.tip_message = `O número é ${generatedNumber >= 500 ? ">= 500" : "<= 500"}`;

        }
    }),
]