import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";


export default abstract class Vote extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote e ganhe pontos")

    static async execute(interaction: CommandInteraction<CacheType>) {

        const link = "https://top.gg/bot/1158185774823506020"
        await interaction.reply({ content: `### Vote para ganhar 300 pontos no [Top.gg](${link})`});

    }

}