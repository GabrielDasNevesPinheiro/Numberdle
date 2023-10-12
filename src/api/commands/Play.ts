import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getTodayDate } from "../../core/utils/Utils";
import { addGuildPlayer, getGuildById, getGuildDefaultChannel } from "../../database/Controllers/GuildController";
import { createPlayer, getPlayerById } from "../../database/Controllers/PlayerController";

type GameManager = {
    attempts: number,
    generatedNumber: number,
}

export default abstract class Play extends Command {

    static inGame: { [userId: string]: GameManager } = {}

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("play")
        .setDescription("Inicia um Numberdle")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        const defaultChannel = await getGuildDefaultChannel(interaction.guildId);
        
        let player = await getPlayerById(interaction.user.id);
        
        const guild = await getGuildById(interaction.guildId);
        
        if (interaction.channelId !== defaultChannel) return;
        
        if (!player) {
            player = await createPlayer(interaction.user.id, 0, interaction.user.username);
        }

        if(!guild.players.includes(player.userId)) {
            await addGuildPlayer(guild.guildId, player.userId);
        }

        if(Play.inGame[player.userId]) {
            await interaction.editReply({ content: "Você já está em jogo :p"});
            return;
        }
        
        
        if (!(player.lastPlayed < getTodayDate()) && player.lastPlayed) return await interaction.editReply({ content: "Você já jogou hoje." });

        await interaction.editReply({ content: "Hmmmmm" });

        const number = Math.floor(Math.random() * 1000);

        Play.inGame[player.userId] = { attempts: 10, generatedNumber: number }

        await interaction.editReply({ content: "Advinhe o seu número entre 0 e 1000 em até 10 chances!"});

    }
}