import { CacheType, CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import Command from "./Command";
import { getGuildDefaultChannel } from "../../database/Controllers/GuildController";


export default abstract class Announce extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Sua mensagem, mestre")
                .setRequired(true))
        .setName("announce")
        .setDescription("Anunciar algo para os usuários nos servers")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        if(!(interaction.user.id === "340933138039439360")) return;

        await interaction.editReply({ content: "Enviando aviso aos servidores..." })

        const announce = interaction.options.get("text").value as string;

        interaction.client.guilds.cache.map(async (guild) => {

            const defaultChannel = await getGuildDefaultChannel(guild.id);

            const channel = guild.channels.cache.get(defaultChannel) as TextChannel;

            if(channel)
                await channel.send(`# AVISO IMPORTANTE :warning: \n${announce}`);

        });

        await interaction.editReply({ content: `Aviso enviado para todos os servidores.` })
    }

}