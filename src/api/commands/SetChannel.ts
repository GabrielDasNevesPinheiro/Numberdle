import { BaseInteraction, CacheType, CommandInteraction, Interaction, SlashCommandBuilder, TextChannel } from "discord.js";


export default abstract class SetChannel {

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