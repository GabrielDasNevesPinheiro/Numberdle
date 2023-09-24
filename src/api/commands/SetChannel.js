import { SlashCommandBuilder } from "discord.js";

const setChannel = new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set Numberdle's default channel.")
    .addChannelOption((option) =>
        option.setName("channel")
        .setDescription("Set a channel.")
        .setRequired(true)
    );

export default setChannel;