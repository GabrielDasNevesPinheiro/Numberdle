import Player from "../Models/Player";


async function getPlayerById(userId: string ): Promise<Player> {

    const player = await Player.findOne({ where: { userId }});
    return player;

}

async function createPlayer(userId: string, score: number, username: string): Promise<Player> {

    return await Player.create({
        userId,
        score,
        username,
    });

}

async function getPlayerBuffs(userId: string) {
    
    const player = await Player.findOne({ where: { userId }});
    return player?.buffs;

}

async function getPlayerStore(userId: string) {

    const player = await Player.findOne({ where: { userId }});
    return player?.store;

}

async function setPlayerBuffs(userId: string, buffs: number[]) {
    
    const player = await Player.findOne({ where: { userId}});
    player.buffs = buffs;
    await player.save();

}

async function setPlayerStore(userId: string, store: number[]) {

    const player = await Player.findOne({ where: { userId}});
    player.store = store;
    await player.save();

}

async function getPlayers(): Promise<Player[]> {

    return await Player.findAll({ order: [['score', 'DESC']] });

}

async function setNickname(userId: string, nick: string) {

    const player = await getPlayerById(userId);
    player.username = nick;
    await player.save();

}

async function setScore(userId: string, score: number) {
    
    const player = await getPlayerById(userId);
    player.score = score;
    await player.save();

}

async function setLastPlayed(userId: string, date: Date) {

    const player = await getPlayerById(userId);
    player.lastPlayed = date;
    await player.save();

}

async function setMultiplier(userId: string, multiplier: number) {
    
    const player = await getPlayerById(userId);
    player.multiplier = multiplier;
    await player.save();

}

export {
    getPlayerById,
    createPlayer,
    getPlayers,
    setNickname,
    setScore,
    setLastPlayed,
    setMultiplier,
}