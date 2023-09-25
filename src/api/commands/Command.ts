import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class Command {
    
    public static command: SlashCommandBuilder
    
    public static execute(interaction: CommandInteraction<CacheType>) {

    }
}