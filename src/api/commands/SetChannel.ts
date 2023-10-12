import { CacheType, ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { createGuild, getGuildById, setDefaultChannel } from "../../database/Controllers/GuildController";

export default abstract class SetChannel extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addChannelOption((option) =>
            option.setName("channel")
                .setDescription("Escolha um canal de texto")
                .setRequired(true))
        .setName("setchannel")
        .setDescription("Configura o canal do Numberdle");

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

            const guild = await getGuildById(interaction.guildId);

            if (!guild) await createGuild(channel as string, interaction.guildId);
            if (guild) {
                await setDefaultChannel(interaction.guildId, channel as string);
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