import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Player from "../../database/Models/Player";
import Command from "./Command";

export default abstract class PlayerScore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to look, if null displays your user score"))
        .setName("player")
        .setDescription("Displays a player score");


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await Player.findOne({ where: { userId: user.id }});

        if (!player) {
            await interaction.editReply({ content: `O usuário ${user.username} nunca jogou Numberdle.` })
            return;
        }

        await interaction.editReply({ content: `${player.username} tem ${player.score} pontos e está ganhando x${player.multiplier} mais pontos.`});
        

    }
}