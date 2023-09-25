import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";


export default abstract class SetChannel extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addChannelOption((option) =>
            option.setName("channel")
                .setDescription("Set a channel.")
                .setRequired(true))
        .setName("setchannel")
        .setDescription("Set Numberdle's default channel.");

    static execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Channel set sucessfuly.");
    }

}

export { SetChannel };