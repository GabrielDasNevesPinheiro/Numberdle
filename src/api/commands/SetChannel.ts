import { CacheType, ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Guild from "../../database/Models/Guild";

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

        if(!interaction.memberPermissions.has("Administrator")) {
            await interaction.editReply({ content: "Você parece não ter permissão para isso."});
        } 

        if (!(interaction.guild.channels.cache.get(channel as string).type === ChannelType.GuildText)) {
            await interaction.editReply({ content: "Canal inválido :(" });
            return;
        }

        try {

            const guild = await Guild.findOne({
                where: { guildId: interaction.guildId }
            });

            if (!guild) await Guild.create({ defaultChannel: channel as string, guildId: interaction.guildId });
            if (guild) {
                guild.defaultChannel = channel as string
                await guild.save();
            }

        } catch (error) {
            await interaction.editReply({ content: "Ocorreu um erro, tente novamente." });
            return;
        }

        await interaction.editReply({
            content: `Configurado para o canal https://discord.com/channels/${interaction.guildId}/${channel} com sucesso`
        });
    }

}