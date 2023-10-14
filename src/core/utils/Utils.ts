// this file contains utility functions

import { Message } from "discord.js";
import Guild from "../../database/Models/Guild";
import Play from "../../api/commands/Play";
import moment from "moment";
import { getPlayerById, setLastPlayed, setMultiplier } from "../../database/Controllers/PlayerController";

export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();

    month = month < 10 ? Number(`0${month}`) : month;
    day = day < 10 ? Number(`0${day}`) : day;

    const diff = moment.duration({ hours: 3, minutes: 0 }); // server GMT +3

    const fullToday = moment(new Date(year, month, day));

    const date = moment(fullToday);
    const calculated = date.subtract(diff).toDate();
    calculated.setHours(0, 0, 0, 0);

    return calculated;
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

    if (guess == Play.inGame[message.author.id].generatedNumber) {

        const player = await getPlayerById(message.author.id);

        const scoreEarned = Math.floor((100 * Play.inGame[message.author.id].attempts) * player.multiplier);
        player.score += scoreEarned;
        player.lastPlayed = getTodayDate();


        message.reply(`Wow, Você acertou o número, era mesmo ${guess}! +${scoreEarned} Pontos (x${player.multiplier} de bônus)`);

        player.multiplier += 0.1;
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

    if (Play.inGame[message.author.id].attempts == 3) {

        let len = Play.inGame[message.author.id].generatedNumber.toString().length - 1
        let toSub = Number(Play.inGame[message.author.id].generatedNumber.toString()[len])

        const minRange = (Play.inGame[message.author.id].generatedNumber) - toSub
        const maxRange = (Play.inGame[message.author.id].generatedNumber + 10) - toSub

        message.reply(`Você tem só mais 3 tentativas! Seu número está entre ${minRange} e ${maxRange}`);
    }

    if (Play.inGame[message.author.id].attempts == 0) {

        const multiplier = (await getPlayerById(message.author.id)).multiplier;

        message.reply(`Você já usou suas 10 tentativas e o número era ${Play.inGame[message.author.id].generatedNumber}  :( \nBoa sorte no próximo dia :)\nSeu bônus de x${multiplier} foi resetado.`);

        await setMultiplier(message.author.id, 1.0);
        await setLastPlayed(message.author.id, getTodayDate());

        delete Play.inGame[message.author.id];
        return;
    }
}