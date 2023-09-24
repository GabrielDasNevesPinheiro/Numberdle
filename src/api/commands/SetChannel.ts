import { BaseInteraction, CacheType, CommandInteraction, Interaction, SlashCommandBuilder, TextChannel } from "discord.js";
import Command from "./interfaces/Command";


export default class SetChannel implements Command {

    command: SlashCommandBuilder = new SlashCommandBuilder()
        .addChannelOption((option) =>
            option.setName("channel")
                .setDescription("Set a channel.")
                .setRequired(true))
        .setName("setchannel")
        .setDescription("Set Numberdle's default channel.");

    execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Channel set sucessfuly.");
    }

}

export { SetChannel };