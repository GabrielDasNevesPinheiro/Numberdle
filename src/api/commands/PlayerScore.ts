import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getPlayerById } from "../../database/Controllers/PlayerController";

export default abstract class PlayerScore extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mostra as informações de algum jogador"))
        .setName("player")
        .setDescription("Escolha um jogador");


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: false });
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await getPlayerById(user.id);

        if (!player) {
            await interaction.editReply({ content: `O usuário ${user.username} nunca jogou Numberdle.` })
            return;
        }

        let embed = new EmbedBuilder().setTitle(`${player.username} :person_bouncing_ball: `)
            .setColor(Colors.Red)
            .setImage(user.avatarURL())
            .addFields([{
                name: "Pontos :moneybag:", value: `${player.score.toLocaleString("pt-BR")}`,
            }, {
                name: "Multiplicador :slot_machine: ", value: `${player.multiplier}x`
            }]);

        await interaction.editReply({ embeds: [embed] });


    }
}