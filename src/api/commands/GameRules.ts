import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./interfaces/Command";

export default class GameRules implements Command {

    command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("gamerules")
        .setDescription("Shows Numberdle game rules.");

    execute(interaction: CommandInteraction<CacheType>): void {
        interaction.reply("Regra n°1 do Clube de regatas do flamengo: Você não comenta do Clube de Regatas do Flamengo.");
    }

}
