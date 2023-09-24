import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
    command: SlashCommandBuilder,
    execute(interaction: CommandInteraction<CacheType>): void
}