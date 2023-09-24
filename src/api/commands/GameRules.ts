import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class GameRules {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("gamerules")
        .setDescription("Shows Numberdle game rules.");

    static execute(interaction: CommandInteraction<CacheType>) {
        interaction.reply("Regra n°1 do Clube de regatas do flamengo: Você não comenta do Clube de Regatas do Flamengo.");
    }

}
