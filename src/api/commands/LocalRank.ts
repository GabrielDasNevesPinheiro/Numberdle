import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./interfaces/Command";

export default class LocalRank implements Command {

    command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("localrank")
        .setDescription("Shows server's rank.");

    execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Here's the local rank.");
    }

}