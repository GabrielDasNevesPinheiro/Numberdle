import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Game from "../../database/Models/Game";
import { BuffMarket } from "../../core/engine/store/BuffMarket";
import { getPlayerById } from "../../database/Controllers/PlayerController";



class Log extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("log").addUserOption(option => 
        option.setName("user")
        .setDescription("Um usuário para ver as informações")
    ).setDescription("Veja detalhadamente os jogos ou um jogo específico de algum jogador")

    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.options.getUser("user")?.id || interaction.user.id;

        if((userId !== interaction.user.id) && !interaction.memberPermissions.has("Administrator")) {
            await interaction.editReply({ content: "Você não tem permissão para ver os dados avançados dos outros jogadores, só os seus." });
            return;
        }

        const player = await getPlayerById(userId);
        let data = (await Game.findAll({ where: { userId: userId }})).sort((prev, next) => prev.date < next.date ? 1 : -1 );

        if(!data.length) {
            await interaction.editReply({ content: "Nenhum registro encontrado." });
            return;
        }

        let embeds = [];
        let active = 0;

        data.forEach((gamedata) => {

            let buffs = gamedata.buffs.map((buff) => BuffMarket[buff as number].name);
            let formatted_buffs = buffs.map(buff => "`"+buff+"` ")
            embeds.push(new EmbedBuilder()
            .setTitle(`Histórico de ${gamedata.date.toLocaleDateString("pt-BR")}`)
            .setAuthor({ name: player.username, 
                iconURL: interaction.client.users.cache.get(gamedata.userId)?.avatarURL() 
                || "https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png" })
            .setDescription(`do usuário <@${gamedata.userId}>`)
            .addFields([
                { name: "Resultado :scroll:", value: gamedata.win ? "Vitória" : "Derrota" },
                { name: "Pontos ganhos :money_with_wings:", value: `${gamedata.earned.toLocaleString("pt-BR")} Pontos` },
                { name: "Pontuação total :moneybag:", value: `${gamedata.score.toLocaleString("pt-BR")} Pontos` },
                { name: "Tentativas usadas :dart:", value: `${gamedata.attempts}` },
                { name: "Buffs usados :pill:", value: buffs.length == 0 ? "Nenhum buff usado" : formatted_buffs.toString().replace(",", "") },
                { name: "Multiplicador :small_red_triangle:", value: `${gamedata.multiplier}x`},
                ]).setColor(Colors.Purple)
            )
        });


        let prev = new ButtonBuilder()
            .setCustomId("previous")
            .setLabel('Próximo dia')
            .setDisabled(active == 0)
            .setStyle(ButtonStyle.Success);

        let next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel('Dia anterior')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(next, prev);


        const response = await interaction.editReply({
            content: "Aqui estão os dados",
            embeds: [embeds[active]],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });

        collector.on('collect', async (confirmation) => {

            if (confirmation.customId === "next") {
                active += active < embeds.length - 1 ? 1 : 0;
            }

            if (confirmation.customId === "previous") {
                active -= active > 0 ? 1 : 0;
            }
        
            prev.setDisabled(active == 0);
            next.setDisabled(active == embeds.length - 1);

            await interaction.editReply({ embeds: [embeds[active]], components: [row] });
            await confirmation.update({ embeds: [embeds[active]], components: [row] });
        });
    }
    
}

export default Log;