import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default abstract class GameRules extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("gamerules")
        .setDescription("Shows Numberdle game rules.");

    static async execute(interaction: CommandInteraction<CacheType>) {

        const embed = new EmbedBuilder().setTitle("Numberdle")
            .setThumbnail('https://images.squarespace-cdn.com/content/v1/50eca855e4b0939ae8bb12d9/1371867381406-C3XPXES7PXTPNQPOXFHD/Black_Number.007.jpg')
            .addFields({
                name: "Como jogar? :thinking:",
                value: "Você pode jogar usando meu comando /play"
            },
            {
                name: "Quando você der play... :point_up:",
                value: "Irei gerar um número aleatório entre 0 e 1000 e você terá que adivinhar."
            },
            {
                name: "Quantas tentativas? :warning:",
                value: "Você tem só 10 tentativas e só joga uma vez por dia."
            }, 
            {
                name: "Ganhe pontos! :money_with_wings:",
                value: "Você ganhará muitos pontos se acertar com poucas tentativas."
            }).setColor(Colors.Red);

        await interaction.reply({ 
            ephemeral: true,
            content: "Eis as regras :nerd: :point_up:",
            embeds: [embed]
        });
    }

}
