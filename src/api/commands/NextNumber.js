import { SlashCommandBuilder } from "discord.js";

const nextNumber = new SlashCommandBuilder()
    .setName("nextnumber")
    .setDescription("When next random number comes?");

export default nextNumber;