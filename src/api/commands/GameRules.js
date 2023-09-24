import { SlashCommandBuilder } from "discord.js";

const gameRules = new SlashCommandBuilder()
    .setName("gamerules")
    .setDescription("Shows Numberdle game rules.");

export default gameRules;