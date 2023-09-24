import { SlashCommandBuilder } from "discord.js";

const rank = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Shows global rank.");

export default rank;