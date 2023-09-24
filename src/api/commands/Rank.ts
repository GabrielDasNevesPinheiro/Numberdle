import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./interfaces/Command";

export default class Rank implements Command {

    command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Shows global rank.");
    
    execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Here's the rank.");
    }

}

