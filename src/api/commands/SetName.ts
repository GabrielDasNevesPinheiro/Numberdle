import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";



export default abstract class SetName extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName("nick")
                .setDescription("Seu novo nickname")
                .setRequired(true)
        ).setName("setname")
        .setDescription("Mude seu nickname no ranking.");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let player = await Player.findOne({ where: { userId: interaction.user.id } });
        const newNick = interaction.options.get("nick").value as string;

        player.username = newNick;
        await player.save();

        await interaction.editReply({ content: `Você mudou seu nick para ${newNick} :)` });

    }

}