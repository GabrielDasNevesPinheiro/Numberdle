import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";
import { getPlayerById } from "../../database/Controllers/PlayerController";



export default abstract class SetName extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName("nick")
                .setDescription("Seu novo nickname")
                .setRequired(true)
        ).setName("setname")
        .setDescription("Use 100 dos seus pontos para trocar seu nickname no ranking");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let player = await getPlayerById(interaction.user.id);

        if (player) {

            const newNick = interaction.options.get("nick").value as string;

            if (player.score < 100 ) {
                await interaction.editReply({ content: "Você não tem pontos o suficiente para isso" });
                return;
            }

            player.username = newNick;
            player.score -= 100;
            await player.save();

            await interaction.editReply({ content: `Você usou 100 pontos e mudou seu nickname para ${newNick} :)` });
        } else {
            await interaction.editReply({ content: "Cara tu nem tá no rank ainda, nem da pra mudar teu nick" });
        }

    }

}