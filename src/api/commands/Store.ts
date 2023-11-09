// players jogando não podem comprar
// quando um item for comprado ele deve ser removido da loja e ser adicionado aos buffs ativos

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById, setPlayerBuffs } from "../../database/Controllers/PlayerController";
import Buff from "../../core/engine/buffs/Buff";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { rarities } from "../../core/engine/enum/Rarity";
import sequelize from "../../database/Connection";
import Player from "../../database/Models/Player";
import { Playing } from "../../core/engine/Playing";
import { attributeNames } from "../../core/engine/enum/Attributes";

export default abstract class Store extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("store")
        .setDescription("Acessa a sua loja");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        if(Playing.inGame[interaction.user.id]) {
            await interaction.editReply({ content: "Você não pode fazer isso em jogo." });
            return;
        }

        const player = await getPlayerById(interaction.user.id);

        await interaction.editReply({ content: "Checando fraudes..." });

        if (!player) {
            await interaction.editReply({ content: "Jogue pelo menos uma vez." });
            return;
        }

        await interaction.editReply({ content: "Checando dados..." });

        if (player.store.length == 0) {
            await interaction.editReply({ content: "Você não tem nenhum item na sua loja." });
            return;
        }

        let buffs: Buff[] = [];

        player.store.forEach((index) => {
            
            buffs.push(BuffMarket[index]);
        });

        let embeds: EmbedBuilder[] = [];
        let active = 0;

        buffs.forEach((buff) => {
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

        let buy = new ButtonBuilder()
            .setCustomId("buy")
            .setLabel('Comprar')
            .setDisabled(buffs[active].price > player.score)
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prev, buy, next);


        const response = await interaction.editReply({
            content: `# Cuidado para não comprar buffs que modificam atributos iguais!`,
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

            if (confirmation.customId === "buy") {
                
                const bought = player.store.splice(active, 1);
                
                embeds.splice(active, 1);
                if(active > embeds.length - 1 ) active -= 1;
                
                let store = player.store.filter((item) => item !== bought[0]);
                player.score -= BuffMarket[bought[0]].price;
                player.buffs = [...player.buffs, bought[0]];
                
                await Player.update({ store: store, buffs: player.buffs, score: player.score }, { where: { userId: player.userId }});
                
            }

            if(embeds.length == 0) {
                await interaction.editReply({ content: "Você já comprou tudo."});
                await confirmation.update({ embeds: [], components: [] });
                return;
            }

            prev.setDisabled(active == 0);
            next.setDisabled(active == embeds.length - 1);
            buy.setDisabled(BuffMarket[player.store[active]].price > player.score);

            await interaction.editReply({ embeds: [embeds[active]], components: [row] });
            await confirmation.update({ embeds: [embeds[active]], components: [row] });
        });

        collector.on('end', async (confirmation) => {
            await interaction.editReply({ components: [] });
            return;
        })

    }


}

