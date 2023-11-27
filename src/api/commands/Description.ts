import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";

export default abstract class Description extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("description")
        .addStringOption(option =>
            option.setName("content")
            .setDescription("Digite o texto da sua descrição")
            .setMinLength(2)
            .setMaxLength(80)
            .setRequired(true)
        ).setDescription("Modifique sua descrição")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let player = await getPlayerById(interaction.user.id);

        if(!player) await interaction.editReply({ content: `Jogue Numberdle antes de fazer isso!` });

        player.description = interaction.options.get("content").value as string;
        await player.save();

        interaction.editReply({ content: `Você alterou sua descrição com sucesso!` });

    }

}