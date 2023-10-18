// this file contains utility functions

import { Message } from "discord.js";
import Guild from "../../database/Models/Guild";
import Play from "../../api/commands/Play";
import moment from "moment";
import { getPlayerById, setLastPlayed, setMultiplier } from "../../database/Controllers/PlayerController";

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

    if (!Play.inGame[message.author.id]) { // if true, player is not playing Numberdle yet to guess his number
        return false;
    };

    if (Number.isNaN(Number(message.content))) { // check if is not a numeric string
        message.react('💀');
        return false;
    }

    return true;
}

export async function applyGameLogic(message: Message<boolean>, guess: number) {

    const { playerEngine } = Play.inGame[message.author.id];

    if (guess == Play.inGame[message.author.id].generatedNumber) {

        const player = await getPlayerById(message.author.id);


        const scoreEarned = Math.floor((playerEngine.score_multiplier * Play.inGame[message.author.id].attempts) * player.multiplier);
        player.score += scoreEarned;
        player.lastPlayed = getTodayDate();


        message.reply(`Wow, Você acertou o número, era mesmo ${guess}! +${scoreEarned} Pontos (x${player.multiplier} de bônus)`);

        player.multiplier += playerEngine.multiplier_gain;
        player.multiplier = Number(player.multiplier.toFixed(1));
        await player.save();

        delete Play.inGame[message.author.id];
        return;
    }

    if (guess < Play.inGame[message.author.id].generatedNumber) {
        message.react('➕');
        Play.inGame[message.author.id].attempts -= 1;
    }

    if (guess > Play.inGame[message.author.id].generatedNumber) {
        message.react('➖');
        Play.inGame[message.author.id].attempts -= 1;
    }

    if (Play.inGame[message.author.id].attempts == playerEngine.tip_attempt) {

        message.reply(playerEngine.buildTipMessage({
            attempts_left: Play.inGame[message.author.id].attempts,
            random_number: Play.inGame[message.author.id].generatedNumber
        }));
    }

    if (Play.inGame[message.author.id].attempts == 0) {

        const multiplier = (await getPlayerById(message.author.id)).multiplier;

        message.reply(`Você já usou suas 10 tentativas e o número era ${Play.inGame[message.author.id].generatedNumber}  :( \nBoa sorte no próximo dia :)\nSeu bônus de x${multiplier} foi resetado.`);

        await setMultiplier(message.author.id, playerEngine.multiplier_reset);
        await setLastPlayed(message.author.id, getTodayDate());

        delete Play.inGame[message.author.id];
        return;
    }
}