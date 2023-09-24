import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class NextNumber {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("nextnumber")
        .setDescription("When next random number comes?");

    static execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Next number comes tomorrow.");
    }

}