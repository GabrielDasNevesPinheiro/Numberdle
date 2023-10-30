import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getTimeDiff } from "../../core/utils/Utils";
import { getPlayerById } from "../../database/Controllers/PlayerController";

export default abstract class NextNumber extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("nextnumber")
        .setDescription("Mostra se o jogo já está disponível");

    static async execute(interaction: CommandInteraction<CacheType>) {
    
        await interaction.deferReply();

        const player = await getPlayerById(interaction.user.id);

        const timeDiff = getTimeDiff(player?.lastPlayed);

        if (!(timeDiff >= 24)) {
            return await interaction.editReply({ content: `Seu jogo valerá pontos em ${24 - timeDiff} horas` });
        }
        
        await interaction.editReply({ content: "Seu jogo valendo pontos já está disponível" });

    }

}