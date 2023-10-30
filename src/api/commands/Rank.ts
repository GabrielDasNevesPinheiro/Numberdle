import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";
import { getPlayerById, getPlayers } from "../../database/Controllers/PlayerController";
import { getGuildPlayers, getGuildRanking } from "../../database/Controllers/GuildController";

export default abstract class Rank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption((option) =>
            option.setName("target")
                .setDescription("Tipo de ranking a ser consultado")
                .addChoices(
                    { name: "Ranking Global", value: "global" },
                    { name: "Ranking Local", value: "local" },
                    { name: "Ranking de Servidores", value: "servers" }
                ).setRequired(true)
        )
        .setName("rank")
        .setDescription("Mostra o ranking do Numberdle");

    static async execute(interaction: CommandInteraction<CacheType>) {


        await interaction.deferReply({});

        let players: Player[] = [];
        let guildRanking: { guildId: string, score: number }[] = [];

        const { value: target } = interaction.options.get("target");

        if (target === "global") {
            players = (await getPlayers());
        }

        if (target === "local") {
            players = await getGuildPlayers(interaction.guildId);
        }

        if (target === "servers") {

            guildRanking = await getGuildRanking();
            guildRanking.sort((first, sec) => first.score > sec.score ? -1 : 1);

        }

        let page = 1;

        let prev = new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Anterior")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Próximo")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, next);

        if (!(target === "servers")) {

            let embed = new EmbedBuilder().setTitle(":trophy: Melhores Jogadores :trophy:").setColor(Colors.Red)
                .setThumbnail(interaction.guild.iconURL({ size: 256 }))

            let place = 0;

            players.forEach((player, index) => {

                if (player.userId === interaction.user.id) {
                    place = index + 1;
                }

            });

            players.slice((5 * page) - 5, 5 * page).forEach((player) => {


                const index = players.indexOf(player) + 1;



                embed.addFields({
                    name: `${index} - ${player.username}`, value: `${player.score.toLocaleString("pt-BR")}`
                });
            });

            let response = await interaction.editReply({ embeds: [embed], components: [row], content: `Você está em ${place}° lugar no ranking <@${interaction.user.id}>` });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 170000 });

            collector.on("collect", async (confirmation) => {

                let embed = new EmbedBuilder().setTitle(":trophy: Melhores jogadores :trophy:").setColor(Colors.Red)
                    .setThumbnail(interaction.guild.iconURL({ size: 256 }))

                if (confirmation.customId === "previous") {
                    page -= 1;
                }

                if (confirmation.customId === "next") {
                    page += 1;
                }

                prev.setDisabled(page == 1);
                next.setDisabled(players.length < page * 5);

                players.slice((5 * page) - 5, 5 * page).forEach((player) => {

                    const index = players.indexOf(player) + 1;

                    embed.addFields({
                        name: `${index}° ${player.username}`, value: `${player.score.toLocaleString("pt-BR")}`
                    });

                })

                if (players.length < page * 5) {
                    embed.setDescription("Sem mais jogadores.");
                }

                await interaction.editReply({ components: [row], embeds: [embed] });
                await confirmation.update({ embeds: [embed], components: [row] });

            });


        } else {

            let embed = new EmbedBuilder().setTitle(":trophy: Ranking de Servidores :trophy:").setColor(Colors.Red)
                .setThumbnail(interaction.guild.iconURL({ size: 256 }))
            let place = 0;

            guildRanking.forEach((guild, index) => {

                if (guild.guildId === interaction.guildId) {
                    place = index + 1;
                }

            });

            guildRanking.slice((5 * page) - 5, 5 * page).forEach((guild) => {

                const guildName = interaction.client.guilds.cache.get(guild.guildId)?.name || "Server desconhecido";
                const index = guildRanking.indexOf(guild) + 1;

                embed.addFields({
                    name: `${index} - ${guildName}`, value: `${guild.score.toLocaleString("pt-BR")}`
                });
            });

            let response = await interaction.editReply({ embeds: [embed], components: [row], content: `Este server está em ${place}° lugar no ranking <@${interaction.user.id}>` });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 170000 });

            collector.on("collect", async (confirmation) => {

                let embed = new EmbedBuilder().setTitle(":trophy: Ranking de Servidores :trophy:").setColor(Colors.Red)
                    .setThumbnail(interaction.guild.iconURL({ size: 256 }))

                if (confirmation.customId === "previous") {
                    page -= 1;
                }

                if (confirmation.customId === "next") {
                    page += 1;
                }

                prev.setDisabled(page == 1);
                next.setDisabled(guildRanking.length < page * 5);

                guildRanking.slice((5 * page) - 5, 5 * page).forEach((guild) => {

                    const guildName = interaction.client.guilds.cache.get(guild.guildId)?.name || "Server desconhecido";
                    const index = guildRanking.indexOf(guild) + 1;

                    embed.addFields({
                        name: `${index} - ${guildName}`, value: `${guild.score.toLocaleString("pt-BR")}`
                    });


                });

                if (guildRanking.length < page * 5) {
                    embed.setDescription("Sem mais Servidores.");
                }

                await interaction.editReply({ components: [row], embeds: [embed] });
                await confirmation.update({ embeds: [embed], components: [row] });

            });
        }

        //await interaction.reply({ embeds: [embed], content: `Você está em ${place}° lugar no ranking <@${interaction.user.id}>`, ephemeral: false });
        //await interaction.reply({ embeds: [embed], content: `Este server está em ${place}° lugar no ranking <@${interaction.user.id}>`, ephemeral: false });

    }



}



