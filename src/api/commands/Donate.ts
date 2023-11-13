import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";


export default abstract class Donate extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Mostra o link de convite para você adicionar o bot em seu server")

    static async execute(interaction: CommandInteraction<CacheType>) {

        const link = "https://imgur.com/iwDRieX"
        await interaction.reply({ content: `### Você pode contribuir para eu continuar funcionando nesse [QRCode pix](${link})`});

    }

}