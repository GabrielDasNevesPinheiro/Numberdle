import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default abstract class LocalRank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("localrank")
        .setDescription("Shows server's rank.");

    static execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Here's the local rank.");
    }

}