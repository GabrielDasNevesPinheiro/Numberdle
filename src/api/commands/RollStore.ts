import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";
import { getBuffMarket } from "../../core/engine/store/MarketGenerator";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { getTimeDiff, getTodayDate } from "../../core/utils/Utils";


let rarities: { [key: number]: { name: string, color: number, image: string }} = {
    
    0: { name: "Normal", color: Colors.Green, image: "https://i.imgur.com/x3z9utF.jpg" },
    1: { name: "Raro", color: Colors.Gold, image: "https://i.imgur.com/0J89wM4.jpg" },
    2: { name: "Normal", color: Colors.Purple, image: "https://i.imgur.com/Wqe95Vz.jpg" }
}

export default abstract class RollStore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rollstore")
        .setDescription("Gire a loja e ganhe 3 buffs para poder comprar");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        await interaction.editReply({ content: "Invocando anciões..." });

        let player = await getPlayerById(interaction.user.id);

        if (!player) {
            await interaction.editReply({ content: "Você precisa ter jogado pelo menos uma vez pra isso..." });
            return;
        }

        if (player.storeDate) {

            if (getTimeDiff(player.storeDate) < 72) {

                await interaction.editReply({ content: `Você poderá rodar a loja em ${72 - getTimeDiff(player.storeDate)} horas` });
                return;

            }

        }

        const buffs = getBuffMarket(BuffMarket);
        const indexes = buffs.map((buff) => BuffMarket.indexOf(buff));

        player.store = indexes;
        player.storeDate = getTodayDate();
        await player.save();

        let embeds = []
        let active = 0;

        buffs.forEach((buff) => {
            embeds.push(new EmbedBuilder().setTitle(`${buff.name}`)
                .setDescription(buff.description)
                .setImage(rarities[buff.rarity].image)
                .addFields({ name: "Preço", value: `${buff.price}` })
                .setFooter({ text: `Raridade: ${rarities[buff.rarity].name}` })
                .setColor(rarities[buff.rarity].color)
            )
        });

        let prev = new ButtonBuilder()
            .setCustomId("previous")
            .setLabel('Anterior')
            .setDisabled(active == 0)
            .setStyle(ButtonStyle.Success);

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prev, next);


        const response = await interaction.editReply({
            content: `Use /store para visualizar os itens da tua loja sempre que precisar`,
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