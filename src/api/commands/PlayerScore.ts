import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";

export default abstract class PlayerScore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mostra as informações de algum jogador"))
        .setName("player")
        .setDescription("Escolha um jogador");


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await getPlayerById(user.id);

        if (!player) {
            await interaction.editReply({ content: `O usuário ${user.username} nunca jogou Numberdle.` })
            return;
        }

        await interaction.editReply({ content: `${player.username} tem ${player.score} pontos e está ganhando x${player.multiplier} mais pontos.`});
        

    }
}