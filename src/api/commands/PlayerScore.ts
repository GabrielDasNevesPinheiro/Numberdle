import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";
import Game from "../../database/Models/Game";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { getMostFrequentElement, getMostFrequentNumbers } from "../../core/utils/Utils";

export default abstract class PlayerScore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mostra as informações de algum jogador"))
        .setName("player")
        .setDescription("Escolha um jogador");


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: false });
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await getPlayerById(user.id);

        if (!player) {
            await interaction.editReply({ content: `O usuário ${user.username} nunca jogou Numberdle.` })
            return;
        }
        let allInfo = await getInfoByUserId(user.id);
        
        let guild = interaction.client.guilds.cache.get(allInfo.favGuildId)?.name || "Não encontrado";

        let usedBuffs = `${allInfo.mostBuffs.map((buff) => '`'+ `${BuffMarket[buff].name}`+ '`').toString()}`.replace(',', " ").replace(',', " ") || "Nenhum"

        let embed = new EmbedBuilder().setTitle(`Informações de ${player.username}`)
            .setColor(Colors.Red)
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .addFields([
                { name: "Pontos", value: `${player.score.toLocaleString("pt-BR")}`, inline: true },
                { name: "Multiplicador", value: `${player.multiplier}x`, inline: true },
                { name: "Multiplicador máximo", value: `${allInfo.maxMultiplier}x`, inline: true },
                { name: "Total de jogos", value: `${allInfo.gamesPlayed} jogos`, inline: true },
                { name: "Jogos essa semana", value: `${allInfo.weekGamesPlayed} jogos`, inline: true },
                { name: "Servidor favorito", value: `${guild}`, inline: true },
                { name: "Winrate", value: `${allInfo.winrate.toFixed(2)}%`, inline: false},
                { name: "Buffs mais usados" , value: usedBuffs }
            ]).setTimestamp(new Date());

        await interaction.editReply({ embeds: [embed] });

            
    }
}


async function getInfoByUserId(userId: string): Promise<{
    gamesPlayed: number
    weekGains: number
    weekGamesPlayed: number
    winrate: number
    mostBuffs: Array<number> 
    maxMultiplier: number
    favGuildId: string
} | null> {
    try {
        // Obtendo as informações necessárias da tabela de jogos
        const allGames = await Game.findAll({
            where: {
                userId: userId,
            },
            attributes: [
                'win',
                'earned',
                'buffs',
                'multiplier',
                'guildId',
                'date',
            ],
        });

        // Filtering last week games
        const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weekGames = allGames.filter((game) => game.date >= weekStart);

        // Winrate calc
        const gamesPlayed = allGames.length;
        const weekGamesPlayed = weekGames.length;
        const wins = allGames.filter((game) => game.win).length;
        const winrate = (wins / gamesPlayed) * 100;

        // calc week gains
        const weekGains = weekGames.reduce((total, game) => total + game.earned, 0);

        // most used buffs
        const allBuffsArray = allGames.map((game) => game.buffs).flat() as number[];
        const mostBuffs = getMostFrequentNumbers(allBuffsArray, 3);

        // max multiplier of all games
        const maxMultiplier = Math.max(...allGames.map((game) => game.multiplier));

        // most played guild
        const allGuildIds = allGames.map((game) => game.guildId);
        const favGuildId = getMostFrequentElement(allGuildIds);

        return {
            gamesPlayed,
            weekGains,
            weekGamesPlayed,
            winrate,
            mostBuffs,
            maxMultiplier,
            favGuildId,
        };
    } catch (error) {

        return null
    }
}