import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class Rank {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Shows global rank.");
    
    static execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Here's the rank.");
    }

}

