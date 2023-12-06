import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";
import { getBuffMarket } from "../../core/engine/store/MarketGenerator";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { checkVoted, getTimeDiff, getTodayDate } from "../../core/utils/Utils";
import { rarities } from "../../core/engine/enum/Rarity";
import { Playing } from "../../core/engine/Playing";
import { attributeNames } from "../../core/engine/enum/Attributes";
import GameSettings from "../../core/engine/GameSettings";

export default abstract class RollStore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rollstore")
        .setDescription(`Gire a loja e ganhe ${GameSettings.buffsPerRoll} buffs para poder comprar`);

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: "Invocando anciões..." });

        let { voted } = await checkVoted(interaction.user.id);

        if(!voted) return await interaction.editReply({ content: "Use `/vote` e vote para poder rolar sua lojinha!" });

        if(Playing.inGame[interaction.user.id]) {
            await interaction.editReply({ content: "Você não pode fazer isso em jogo." });
            return;
        }

        let player = await getPlayerById(interaction.user.id);

        if (!player) {
            await interaction.editReply({ content: "Você precisa ter jogado pelo menos uma vez pra isso..." });
            return;
        }

        if (player.storeDate) {

            if (getTimeDiff(player.storeDate) < GameSettings.rollCooldown) {

                await interaction.editReply({ content: `Você poderá rodar a loja em ${GameSettings.rollCooldown - getTimeDiff(player.storeDate)} horas` });
                return;

            }

        }
        await interaction.editReply({ content: "Resetando buffs atuais..." });

        if(player.buffs.length > 0) {
            player.buffs = [];
            await player.save();
        }

        let toShuffle = BuffMarket.map((buff) => buff);
        const buffs = getBuffMarket(toShuffle);
        let indexes = BuffMarket.map((buff, index) => {
            
            for (let buff2 of buffs) {
                if (buff2.name === buff.name) return index;
            }
            
        });

        indexes = indexes.filter(index => index !== undefined);

        player.store = indexes;
        player.storeDate = getTodayDate();
        await player.save();

        let embeds = [];
        let active = 0;

        indexes.forEach((index) => {
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
            .setStyle(ButtonStyle.Success);

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prev, next);


        const response = await interaction.editReply({
            content: "# Use `/store` para comprar",
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