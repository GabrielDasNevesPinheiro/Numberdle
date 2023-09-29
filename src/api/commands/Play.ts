import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Guild from "../../database/Models/Guild";
import Player from "../../database/Models/Player";
import { getTodayDate } from "../../core/utils/Utils";

type GameManager = {
    attempts: number,
    generatedNumber: number,
}

export default abstract class Play extends Command {

    static inGame: { [userId: string]: GameManager } = {}

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("play")
        .setDescription("Time to play today's Numberdle!")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        const { defaultChannel } = await Guild.findOne({ where: { guildId: interaction.guildId }});
        let player = await Player.findOne({ where: { userId: interaction.user.id }});
        
        if (interaction.channelId !== defaultChannel) return;

        if(Play.inGame[player.userId]) {
            await interaction.editReply({ content: "Você já está em jogo :p"});
            return;
        }
        
        if (!player) {
            player = await Player.create({ userId: interaction.user.id, score: 0, username: interaction.user.username });
            const guild = await Guild.findOne({ where: {
                guildId: interaction.guildId
            }});

            guild.players = [...guild.players, player.userId];

            await guild.save();
        }
        
        if (!(player.lastPlayed < getTodayDate()) && player.lastPlayed) return await interaction.editReply({ content: "Você já jogou hoje." });

        await interaction.editReply({ content: "Hmmmmm" });

        const number = Math.floor(Math.random() * 1000);

        Play.inGame[player.userId] = { attempts: 10, generatedNumber: number }

        await interaction.editReply({ content: "Advinhe o seu número entre 0 e 1000 em até 10 chances!"});

    }
}