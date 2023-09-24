import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./interfaces/Command";

export default class NextNumber implements Command {

    command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("nextnumber")
        .setDescription("When next random number comes?");

    execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Next number comes tomorrow.");
    }

}