import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default abstract class GameRules extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("gamerules")
        .setDescription("Shows Numberdle game rules.");

    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.reply({ 
            ephemeral: true,
            content: "Diariamente eu irei gerar um número aleatório e cabe a você advinhar que número é esse, você terá apenas 10 chances. Você ganhará mais pontos se acertar com poucas tentativas... Boa sorte! :nerd:"
        });
    }

}
