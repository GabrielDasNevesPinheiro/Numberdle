import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";


export default abstract class Invite extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Mostra o link de convite para você adicionar o bot em seu server")

    static async execute(interaction: CommandInteraction<CacheType>) {

        const link = "https://discord.com/oauth2/authorize?client_id=1158185774823506020&permissions=2147485696&scope=bot%20applications.commands"

        await interaction.reply({ content: `Me adicione em seu server por [aqui](${link})`});

    }

}