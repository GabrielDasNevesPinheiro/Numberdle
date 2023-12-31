// this file contains utility functions

import { ChannelType, Message, TextChannel } from "discord.js";
import Guild from "../../database/Models/Guild";
import moment from "moment";
import { getPlayerById, setLastPlayed, setMultiplier, setPlayerBuffs } from "../../database/Controllers/PlayerController";
import { Playing } from "../engine/Playing";
import Game from "../../database/Models/Game";
import axios from "axios";



export function getTodayDate() {

    return moment(new Date()).toDate();

}


export function getTimeDiff(date1: Date) { // gets the hour offset between the given date and now

    if (!date1) return 24;

    const firstDate = moment(date1); // Substitua com sua data de ontem
    const now = moment(); // A data atual é usada aqui

    const diff = now.diff(firstDate, 'hours');

    return diff;
}

export async function isValidMessage(message: Message<boolean>, clientId: string): Promise<boolean> {

    if (message.author.id === clientId) return false;
    if (message.channel.type === ChannelType.DM) return false;

    const defaultChannel = (await Guild.findOne({ where: { guildId: message.guildId } }))?.defaultChannel;

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
    let channel = message.channel as TextChannel;
    let author = message.author

    const { playerEngine } = Playing.inGame[message.author.id];

    if (guess == Playing.inGame[message.author.id].generatedNumber) {

        const player = await getPlayerById(message.author.id);

        if (playerEngine.roleplay) {
            await channel.send(`<@${author.id}>` + "Você acertou! Parabéns.");
            delete Playing.inGame[player.userId];
            return;
        }

        const scoreEarned = Math.floor((playerEngine.score_multiplier * (Playing.inGame[message.author.id].attempts == 0 ? 1 : Playing.inGame[message.author.id].attempts)) * player.multiplier);
        player.score += scoreEarned;
        player.lastPlayed = getTodayDate();


        await channel.send(`<@${author.id}> Wow, Você acertou o número, era mesmo ${guess}! +${scoreEarned} Pontos (x${player.multiplier} de bônus)`);

        player.multiplier += playerEngine.multiplier_gain;
        player.multiplier = Number(player.multiplier.toFixed(1));

        let buffs = player.buffs;

        await player.save();
        await setPlayerBuffs(message.author.id, []);


        let userEngine = Playing.inGame[player.userId];
        await Game.create({
            date: getTodayDate(),
            userId: player.userId,
            attempts: userEngine.playerEngine.max_attempts - userEngine.attempts,
            multiplier: player.multiplier,
            score: player.score,
            earned: scoreEarned,
            win: true,
            buffs,
            guildId: message.guildId,
        });

        delete Playing.inGame[message.author.id];
        return;
    }

    if (!(message.channel as TextChannel).permissionsFor(message.client.user).has('ManageMessages')) {

        if (guess < Playing.inGame[message.author.id].generatedNumber) {
            let num = message.content;
            await channel.send(`⬆️ ${num}`);
            Playing.inGame[message.author.id].attempts -= 1;
        }

        if (guess > Playing.inGame[message.author.id].generatedNumber) {
            let num = message.content;
            await channel.send(`🔻 ${num}`);
            Playing.inGame[message.author.id].attempts -= 1;
        }
    } else {

        if (guess < Playing.inGame[message.author.id].generatedNumber) {
            let num = message.content;
            await message.delete();
            await channel.send(`⬆️ ${num}`);
            Playing.inGame[message.author.id].attempts -= 1;
        }

        if (guess > Playing.inGame[message.author.id].generatedNumber) {
            let num = message.content;
            await message.delete();
            await channel.send(`🔻 ${num}`);
            Playing.inGame[message.author.id].attempts -= 1;
        }
    }

    if (Playing.inGame[message.author.id].attempts == playerEngine.default_tip_attempt) {

        if (!Playing.inGame[message.author.id].playerEngine.wrap_default_tip)
            await channel.send(`<@${author.id}> ` + playerEngine.buildTipMessage({
                attempts_left: Playing.inGame[message.author.id].attempts,
                random_number: Playing.inGame[message.author.id].generatedNumber
            }));

    }

    if (Playing.inGame[message.author.id].attempts == playerEngine.tip_attempt) {

        if (Playing.inGame[message.author.id].playerEngine.tip_message) {
            await channel.send(`<@${author.id}> ` + playerEngine.tip_message);
        }

    }

    if (Playing.inGame[message.author.id].attempts == 0) {

        const multiplier = (await getPlayerById(message.author.id)).multiplier;

        let message_text = `<@${author.id}> Você já usou suas ${playerEngine.max_attempts} tentativas e o número era ${Playing.inGame[message.author.id].generatedNumber}  :( `;

        if (!playerEngine.roleplay) {

            if (!(playerEngine.multiplier_reset == 0)) {

                await setMultiplier(message.author.id, playerEngine.multiplier_reset);
                message_text += `\nSeu bônus de x${multiplier} foi resetado.`

            }

            await setLastPlayed(message.author.id, getTodayDate());

            const player = await getPlayerById(message.author.id);
            const userEngine = Playing.inGame[player.userId];

            await Game.create({
                date: getTodayDate(),
                userId: player.userId,
                attempts: userEngine.playerEngine.max_attempts - userEngine.attempts,
                multiplier: player.multiplier,
                score: player.score,
                earned: 0,
                win: false,
                buffs: player.buffs,
                guildId: message.guildId,
            });

            await setPlayerBuffs(message.author.id, []);

        }

        await channel.send(message_text);
        delete Playing.inGame[message.author.id];
        return;

    }

}

export function isPrime(num: number): boolean {
    if (num <= 1) {
        return false;
    }

    if (num <= 3) {
        return true;
    }

    if (num % 2 === 0 || num % 3 === 0) {
        return false;
    }

    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }

    return true;
}


export async function checkVoted(userId: string): Promise<{ voted: boolean }> {
    const res: { voted: boolean } = (await axios.get(`https://top.gg/api/bots/1158185774823506020/check?userId=${userId}`, {
        headers: {
            "Authorization": process.env.TOPGG
        }
    })).data;
    res.voted = Boolean(res.voted);
    return res;
}

export function getMostFrequentElement(arr: string[]): string {
    const frequencyMap = new Map();
    arr.forEach((element) => {
        frequencyMap.set(element, (frequencyMap.get(element) || 0) + 1);
    });
    const maxFrequency = Math.max(...frequencyMap.values());
    return [...frequencyMap.entries()].find(([_, freq]) => freq === maxFrequency)?.[0] || '';
}

export function getMostFrequentNumbers(arr: number[], count: number): number[] {
    const frequencyMap = new Map();
    arr.forEach((num) => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    });
    return Array.from(frequencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map((entry) => entry[0]);
}
