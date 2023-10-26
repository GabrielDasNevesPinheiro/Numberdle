// All buffs are implemented staticly in the array.
// when a player rolls his store, code will sort the buffs by the array.

import { isPrime } from "../../utils/Utils";
import { Playing } from "../Playing";
import Buff from "../buffs/Buff";
import { Attributes } from "../enum/Attributes";
import { Rarity } from "../enum/Rarity";

export const BuffMarket = [

    new Buff({
        name: "Benção do Trapaceiro",
        price: 150,
        rarity: Rarity.NORMAL,
        description: "Ao iniciar o jogo, te direi se o número é maior ou menor que 500.",
        targets: [Attributes.TIP_TIME, Attributes.TIP_TYPE],

        apply: (userId: string) => {

            const { generatedNumber } = Playing.inGame[userId];

            Playing.inGame[userId].playerEngine.tip_attempt = Playing.inGame[userId].playerEngine.max_attempts;
            Playing.inGame[userId].playerEngine.tip_message = `O número é ${generatedNumber >= 500 ? ">= 500" : "<= 500"}`;

        }
    }),

    new Buff({
        name: "O Dialeto das Prima",
        price: 200,
        rarity: Rarity.NORMAL,
        description: '"As Prima sabe muito piá". No início do jogo você saberá se o número é primo ou não.',
        targets: [Attributes.TIP_TIME, Attributes.TIP_TYPE],

        apply: (userId: string) => {

            const { generatedNumber } = Playing.inGame[userId];
            const primo = isPrime(generatedNumber);

            Playing.inGame[userId].playerEngine.tip_attempt = Playing.inGame[userId].playerEngine.max_attempts;
            Playing.inGame[userId].playerEngine.tip_message = `O número ${primo ? "é primo" : "não é primo"}.`;

        }
    }),

    new Buff({
        name: "Auxílio da Beneficente",
        price: 320,
        rarity: Rarity.RARE,
        description: 'Você será beneficiado com a antecipação da dica padrão, sua dica aparecerá quando restarem 6 tentativas.',
        targets: [Attributes.TIP_TIME],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.default_tip_attempt = 6;
            Playing.inGame[userId].playerEngine.tip_message = undefined;


        }
    }),

    new Buff({
        name: "Esmola do Sábio",
        price: 330,
        rarity: Rarity.RARE,
        description: 'O Sábio sabe muito, ao comprar, ele irá melhorar muito a dica.',
        targets: [Attributes.TIP_TYPE],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.wrap_default_tip = true;
            Playing.inGame[userId].playerEngine.tip_range = 2;
            Playing.inGame[userId].playerEngine.tip_message = Playing.inGame[userId].playerEngine.buildTipMessage({
                attempts_left: Playing.inGame[userId].playerEngine.tip_attempt,
                random_number: Playing.inGame[userId].generatedNumber,
            });


        }
    }),

    new Buff({
        name: "Ajudante Divino",
        price: 400,
        rarity: Rarity.EPIC,
        description: 'Quando faltarem 7 tentativas, Você receberá a Dica Divina.',
        targets: [Attributes.TIP_TYPE, Attributes.TIP_TIME],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.wrap_default_tip = true;
            Playing.inGame[userId].playerEngine.tip_attempt = 7;
            const { generatedNumber } = Playing.inGame[userId];

            let len = generatedNumber.toString().length - 1;
            let toSub = Number(generatedNumber.toString()[len]);

            const minRange = generatedNumber - toSub;
            const maxRange = (generatedNumber + 10) - toSub;

            let numbers = [];
            let isnot = [];

            for (let i = minRange; i <= maxRange; i++) {
                numbers.push(i);
            }

            for (let i = 1; i <= 5;) {
                let rand = Math.floor(Math.random() * (maxRange - minRange));

                if (numbers[rand] != generatedNumber && isnot.indexOf(numbers[rand]) == -1) {
                    isnot.push(numbers[rand]);
                    i++;
                }
            }

            Playing.inGame[userId].playerEngine.tip_message = Playing.inGame[userId].playerEngine.buildTipMessage({
                attempts_left: Playing.inGame[userId].playerEngine.tip_attempt,
                random_number: Playing.inGame[userId].generatedNumber,
                adittional: `Mas não é nenhum desses números: [${isnot.map((num) => `${num}`)}]`
            });



        }
    }),

    new Buff({
        name: "O Corrupto",
        price: 460,
        rarity: Rarity.EPIC,
        description: 'Ao aderir a corrupção, a dica aparece ao iniciar o jogo.',
        targets: [Attributes.TIP_TIME],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.default_tip_attempt = 10;
            Playing.inGame[userId].playerEngine.tip_message = Playing.inGame[userId].playerEngine.buildTipMessage({
                attempts_left: Playing.inGame[userId].playerEngine.default_tip_attempt,
                random_number: Playing.inGame[userId].generatedNumber

            });



        }
    }),

    new Buff({
        name: "Vantagem do Contador",
        price: 200,
        rarity: Rarity.NORMAL,
        description: 'Concede ao portador 1 tentativa extra no jogo, totalizando 11 ao invés de 10.',
        targets: [Attributes.ATTEMPTS],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 11;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),

    new Buff({
        name: "Vantagem do Matemático",
        price: 250,
        rarity: Rarity.NORMAL,
        description: 'O Matemático concede 2 tentativas extras, totalizando 12 tentativas.',
        targets: [Attributes.ATTEMPTS],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 12;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),
    
    new Buff({
        name: "Ganância do Mestre",
        price: 320,
        rarity: Rarity.RARE,
        description: 'A Ganância permite mais 3 tentativas, totalizando 13 tentativas.',
        targets: [Attributes.ATTEMPTS],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 13;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),

    new Buff({
        name: "Trapaça",
        price: 270,
        rarity: Rarity.RARE,
        description: 'Aumenta o número de tentativas para 14.',
        targets: [Attributes.ATTEMPTS],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 14;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),

    new Buff({
        name: "O Oportunista",
        price: 440,
        rarity: Rarity.EPIC,
        description: 'Aumenta o número de tentativas para 15.',
        targets: [Attributes.ATTEMPTS],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 15;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),

    new Buff({
        name: "Tesoureiro à risco",
        price: 390,
        rarity: Rarity.EPIC,
        description: 'Reduz o número de tentativas para 5, mas concede 3x mais pontos se você acertar.',
        targets: [Attributes.ATTEMPTS, Attributes.SCORE],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.max_attempts = 5;
            Playing.inGame[userId].playerEngine.score_multiplier *= 3;
            Playing.inGame[userId].attempts = Playing.inGame[userId].playerEngine.max_attempts;
        
        }
    }),

    new Buff({
        name: "Derrota segura",
        price: 100,
        rarity: Rarity.NORMAL,
        description: 'Seu multiplicador não será resetado se você perder.',
        targets: [Attributes.MULTIPLIER],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.multiplier_reset = 0;
        
        }
    }),

    new Buff({
        name: "Futuro Próspero",
        price: 100,
        rarity: Rarity.NORMAL,
        description: 'Se você ganhar, adiciona mais 0.3x no seu multiplicador para o dia seguinte.',
        targets: [Attributes.MULTIPLIER],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.multiplier_gain = 0.3;
        
        }
    }),

    new Buff({
        name: "Ampliador Cósmico",
        price: 300,
        rarity: Rarity.RARE,
        description: 'Se você ganhar, adiciona mais 0.5x no seu multiplicador para o dia seguinte.',
        targets: [Attributes.MULTIPLIER],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.multiplier_gain = 0.5;
        
        }
    }),

    new Buff({
        name: "Ampulheta dos Milênios",
        price: 320,
        rarity: Rarity.RARE,
        description: 'Se você ganhar, adiciona mais 1.0x no seu multiplicador para o dia seguinte.',
        targets: [Attributes.MULTIPLIER],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.multiplier_gain = 1.0;
        
        }
    }),

    new Buff({
        name: "Ímpeto Celular",
        price: 590,
        rarity: Rarity.EPIC,
        description: 'No fim da rodada, adiciona mais 1.8x no seu multiplicador para o dia seguinte.',
        targets: [Attributes.MULTIPLIER],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.multiplier_gain = 1.8;
        
        }
    }),

    new Buff({
        name: "O Ladrão",
        price: 240,
        rarity: Rarity.NORMAL,
        description: 'O ladrão te dará 1.2x mais pontos ao acertar o número.',
        targets: [Attributes.SCORE],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.score_multiplier *= 1.2;
        
        }
    }),

    new Buff({
        name: "O Assaltante",
        price: 300,
        rarity: Rarity.NORMAL,
        description: 'O Assaltante te dará 1.5x mais pontos ao acertar o número.',
        targets: [Attributes.SCORE],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.score_multiplier *= 1.5;
        
        }
    }),

    new Buff({
        name: "Banqueiro Santo Ander",
        price: 800,
        rarity: Rarity.EPIC,
        description: 'Aumenta em 3x os seus ganhos',
        targets: [Attributes.SCORE],

        apply: (userId: string) => {

            Playing.inGame[userId].playerEngine.score_multiplier *= 3;
        
        }
    }),

]