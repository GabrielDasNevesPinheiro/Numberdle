import Guild from "../Models/Guild"
import Player from "../Models/Player";
import { getPlayerById } from "./PlayerController";

async function getGuildById(guildId: string): Promise<Guild> {

    return await Guild.findOne({
        where: {
            guildId
        }
    });

}

async function getGuildDefaultChannel(guildId: string): Promise<string> {

    const guild = await getGuildById(guildId);

    return guild.defaultChannel;

}

async function getGuildPlayers(guildId: string): Promise<Player[]> {

    let players: Player[] = [];

    const guildPlayers = (await Guild.findOne({ where: { guildId } })).players;
    await Promise.all(guildPlayers.map(async (userId) => {

        const guildPlayer = await getPlayerById(userId);
        players.push(guildPlayer);
        players.sort((first, next) => first.score > next.score ? -1 : 1);

    }));

    return players;

}

async function addGuildPlayer(guildId: string, userId: string) {
    
    let guild = await getGuildById(guildId);
    guild.players = [...guild.players, userId];
    await guild.save();
}

async function createGuild(defaultChannel: string, guildId: string) {

    const guild = await getGuildById(guildId);

    if(!guild) {
        
        await Guild.create({
            defaultChannel,
            guildId
        });

    }

}

async function setDefaultChannel(guildId: string, channel: string) {

    const guild = await getGuildById(guildId);
    guild.defaultChannel = channel;
    await guild.save();

}

export {
    getGuildById,
    getGuildPlayers,
    getGuildDefaultChannel,
    addGuildPlayer,
    createGuild,
    setDefaultChannel
}