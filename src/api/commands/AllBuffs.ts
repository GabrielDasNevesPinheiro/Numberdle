import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { rarities } from "../../core/engine/enum/Rarity";

export default abstract class AllBuffs extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("allbuffs")
        .setDescription("Mostra todos os buffs existentes atualmente.");


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let embeds: EmbedBuilder[] = [];
        let active = 0;


        BuffMarket.forEach((buff, index) => {

            embeds.push(new EmbedBuilder().setTitle(`${buff.name}`)
                .setDescription(buff.description)
                .setImage(rarities[buff.rarity].image)
                .addFields({ name: "Valor", value: `${buff.price}` })
                .setFooter({ text: `Raridade: ${rarities[buff.rarity].name}` })
                .setColor(rarities[buff.rarity].color)
            )
        });

        let prev = new ButtonBuilder()
            .setCustomId(`previous`)
            .setLabel(`<`)
            .setDisabled(active == 0)
            .setStyle(ButtonStyle.Primary);

        let next = new ButtonBuilder()
            .setCustomId(`next`)
            .setLabel(`>`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prev, next);


        const response = await interaction.editReply({
            content: `Todos os Buffs adicionados no Numberdle (${active + 1} / ${embeds.length})`,
            embeds: [embeds[active]],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 170000 })

        collector.on('collect', async (confirmation) => {

            if (confirmation.customId === "next") {
                active += active < embeds.length - 1 ? 1 : 0;
            }

            if (confirmation.customId === "previous") {
                active -= active > 0 ? 1 : 0;
            }

            prev.setDisabled(active == 0);
            next.setDisabled(active == embeds.length - 1);
            
            await interaction.editReply({ content: `Todos os Buffs adicionados no Numberdle (${active + 1} / ${embeds.length})`, embeds: [embeds[active]], components: [row] });
            await confirmation.update({ embeds: [embeds[active]], components: [row] });
        });

        collector.on('end', async (confirmation) => {
            await interaction.editReply({ components: [] });
            return;
        })

    }
}