import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getTodayDate } from "../../core/utils/Utils";
import { getPlayerById } from "../../database/Controllers/PlayerController";

export default abstract class NextNumber extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("nextnumber")
        .setDescription("Mostra se o jogo já está disponível");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        const user = await getPlayerById(interaction.user.id);

        if((user?.lastPlayed < getTodayDate()) || !user?.lastPlayed) {
            await interaction.editReply({ content: "Seu Numberdle de hoje está disponível"});
        } else {
            await interaction.editReply({ content: "Você poderá jogar só amanhã"});
        }

    }

}