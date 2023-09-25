import { CacheType, ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

const channelSettings: { [guildId: string]: string } = {}

export default abstract class SetChannel extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addChannelOption((option) =>
            option.setName("channel")
                .setDescription("Set a channel.")
                .setRequired(true))
        .setName("setchannel")
        .setDescription("Set Numberdle's default channel.");

    static async execute(interaction: CommandInteraction<CacheType>) {

        const channel = interaction.options.get('channel').value;
        await interaction.deferReply({ ephemeral: true });

        if (!(interaction.guild.channels.cache.get(channel as string).type === ChannelType.GuildText)){
            await interaction.editReply({ content: "Canal inválido :(" });
            return;
        }

        await interaction.editReply({
            content: `Configurado para o canal https://discord.com/channels/${interaction.guildId}/${channel} com sucesso`
        });
    }

}