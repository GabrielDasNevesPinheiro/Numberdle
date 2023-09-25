import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default abstract class Rank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Shows global rank.");
    
    static execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Here's the rank.");
    }

}

