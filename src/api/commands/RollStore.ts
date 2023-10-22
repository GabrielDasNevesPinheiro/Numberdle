import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";
import { getBuffMarket } from "../../core/engine/store/MarketGenerator";
import { BuffMarket } from "../../core/engine/store/BuffMarket";



export default abstract class RollStore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rollstore")
        .setDescription("Gire a loja e ganhe 3 buffs para poder comprar");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({  });
        await interaction.editReply({ content: "Invocando anciões..."});

        let player = await getPlayerById(interaction.user.id);

        if (player) {

            const buffs = getBuffMarket(BuffMarket);
            const indexes = buffs.map((buff) => BuffMarket.indexOf(buff));
            
            player.store = indexes;
            await player.save();

            await interaction.editReply({ content: `${indexes}` });
            
        }

    }

}