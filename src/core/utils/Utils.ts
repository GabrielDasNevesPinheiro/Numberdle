// this file contains utility functions

import { Message } from "discord.js";
import Guild from "../../database/Models/Guild";
import Play from "../../api/commands/Play";
import moment from "moment";
import { getPlayerById, setLastPlayed, setMultiplier } from "../../database/Controllers/PlayerController";
import { Playing } from "../engine/Playing";

export function getTodayDate() {
    
    return moment(new Date()).toDate();
    
}


export function getTimeDiff(date1: Date) { // gets the hour offset between the given date and now

    if(!date1) return 24;

    const firstDate = moment(date1); // Substitua com sua data de ontem
    const now = moment(); // A data atual é usada aqui

    const diff = now.diff(firstDate, 'hours');

    return diff;
}

export async function isValidMessage(message: Message<boolean>, clientId: string): Promise<boolean> {

    if (message.author.id === clientId) return false;

    const { defaultChannel } = await Guild.findOne({ where: { guildId: message.guildId } });

    if (message.channelId !== defaultChannel) return false; // dont answer if is not Numberdle's channel

    if (!Playing.inGame[message.author.id]) { // if true, player is not playing Numberdle yet to guess his number
        return false;
    };

    if (Number.isNaN(Number(message.content))) { // check if is not a numeric string
        message.react('💀');
        return false;
    }

    return true;
}

export async function applyGameLogic(message: Message<boolean>, guess: number) {

    const { playerEngine } = Playing.inGame[message.author.id];

    if (guess == Playing.inGame[message.author.id].generatedNumber) {

        const player = await getPlayerById(message.author.id);


        const scoreEarned = Math.floor((playerEngine.score_multiplier * Playing.inGame[message.author.id].attempts) * player.multiplier);
        player.score += scoreEarned;
        player.lastPlayed = getTodayDate();


        message.reply(`Wow, Você acertou o número, era mesmo ${guess}! +${scoreEarned} Pontos (x${player.multiplier} de bônus)`);

        player.multiplier += playerEngine.multiplier_gain;
        player.multiplier = Number(player.multiplier.toFixed(1));
        await player.save();

        delete Playing.inGame[message.author.id];
        return;
    }

    if (guess < Playing.inGame[message.author.id].generatedNumber) {
        message.react('➕');
        Playing.inGame[message.author.id].attempts -= 1;
    }

    if (guess > Playing.inGame[message.author.id].generatedNumber) {
        message.react('➖');
        Playing.inGame[message.author.id].attempts -= 1;
    }

    if (Playing.inGame[message.author.id].attempts == playerEngine.tip_attempt) {

        if(playerEngine.tip_message)
            message.reply(playerEngine.tip_message);
            playerEngine.tip_message = undefined;

        if(!playerEngine.wrap_default_tip && Playing.inGame[message.author.id].attempts > 3) {
            playerEngine.tip_attempt = 3;
            return;
        }

        if(!playerEngine.wrap_default_tip) {
            message.reply(playerEngine.buildTipMessage({
                attempts_left: Playing.inGame[message.author.id].attempts,
                random_number: Playing.inGame[message.author.id].generatedNumber
            }));
        }

    }

    if (Playing.inGame[message.author.id].attempts == 0) {

        const multiplier = (await getPlayerById(message.author.id)).multiplier;

        message.reply(`Você já usou suas 10 tentativas e o número era ${Playing.inGame[message.author.id].generatedNumber}  :( \nBoa sorte no próximo dia :)\nSeu bônus de x${multiplier} foi resetado.`);

        await setMultiplier(message.author.id, playerEngine.multiplier_reset);
        await setLastPlayed(message.author.id, getTodayDate());

        delete Playing.inGame[message.author.id];
        return;
    }
}