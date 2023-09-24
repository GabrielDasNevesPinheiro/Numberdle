import { SlashCommandBuilder } from "discord.js";

const localRank = new SlashCommandBuilder()
    .setName("localrank")
    .setDescription("Shows server's rank.");

export default localRank;