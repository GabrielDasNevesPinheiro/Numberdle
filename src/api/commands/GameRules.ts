import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default abstract class GameRules extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("gamerules")
        .setDescription("Mostra como o jogo funciona");

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
                },
                {
                    name: "Temos também a loja de Buffs! :fire:",
                    value: "Use /rollstore para rolar sua loja, você pode fazer isso a cada 3 dias, você ganhará 3 buffs aleatórios"
                },
                {
                    name: "Ganhe muito mais pontos com seus buffs! :moneybag:",
                    value: "Você gasta seus pontos com buffs da loja e se você usar bem seus buffs, você ganhará muito mais pontos ainda. Use /store para comprar (caso não tenha nada na loja, use /rollstore primeiro)"
                }, {
                name: "Tipos de Buffs :yin_yang:",
                value: "Existem Buffs Normais, Raros e Épicos. Boa sorte para conseguir os Épicos!"
            }, {
                name: "Veja os seus Buffs ou os de alguém :smile:",
                value: "Utilize /buffs para ver os buffs ativos de um usuário, ou os seus"
            }, {
                name: "Veja todos os buffs adicionados até agora :face_with_monocle:",
                value: "Usando /allbuffs você vê todos os buffs que o Numberdle possui atualmente"
            }).setColor(Colors.Red);

        await interaction.reply({
            ephemeral: true,
            content: "Eis as regras :nerd: :point_up:",
            embeds: [embed]
        });
    }

}
