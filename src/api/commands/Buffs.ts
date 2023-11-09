import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerBuffs } from "../../database/Controllers/PlayerController";
import { rarities } from "../../core/engine/enum/Rarity";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { attributeNames } from "../../core/engine/enum/Attributes";


export default abstract class Buffs extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addUserOption((option) => option.setName("user")
            .setDescription("Usuário para checar buffs, se vazio você verá seus buffs"))
        .setName("buffs")
        .setDescription("Exibe os buffs de alguém")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true })

        const target = interaction.options.getUser("user") || interaction.user;

        const buffs = await getPlayerBuffs(target.id);
        let embeds = [];
        let active = 0;

        if (!buffs || buffs?.length == 0) {
            await interaction.editReply({ content: "Sem buffs ativos" });
            return;
        }


        buffs.forEach((index) => {
            let buff = BuffMarket[index];

            let modifiers: string = "";
            
            modifiers += buff.targets.map((target) => "`" + attributeNames[target] + "`").toString().replace(",", " ");

            embeds.push(new EmbedBuilder().setTitle(`${buff.name}`)
                .setDescription(buff.description)
                .setImage(rarities[buff.rarity].image)
                .addFields([{ name: "Preço", value: `${buff.price}` }, { name: "Atributos modificados", value: modifiers }])
                .setFooter({ text: `Raridade: ${rarities[buff.rarity].name}` })
                .setColor(rarities[buff.rarity].color)
            )
        });

        let prev = new ButtonBuilder()
            .setCustomId("previous")
            .setLabel('Anterior')
            .setDisabled(active == 0)
            .setStyle(ButtonStyle.Primary);

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prev, next);


        const response = await interaction.editReply({
            content: `Buffs ativos de ${target.username}`,
            embeds: [embeds[active]],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 })

        collector.on('collect', async (confirmation) => {

            if (confirmation.customId === "next") {
                active += active < embeds.length - 1 ? 1 : 0;
            }

            if (confirmation.customId === "previous") {
                active -= active > 0 ? 1 : 0;
            }

            prev.setDisabled(active == 0);
            next.setDisabled(active == embeds.length - 1);

            await interaction.editReply({ embeds: [embeds[active]], components: [row] });
            await confirmation.update({ embeds: [embeds[active]], components: [row] });
        });

        collector.on('end', async (confirmation) => {
            await interaction.editReply({ components: [] });
            return;
        })

    }

}
