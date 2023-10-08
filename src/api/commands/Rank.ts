import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";
import Guild from "../../database/Models/Guild";

export default abstract class Rank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption((option) =>
            option.setName("target")
                .setDescription("Tipo de ranking a ser consultado")
                .addChoices(
                    { name: "Ranking Global", value: "global" },
                    { name: "Ranking Local", value: "local" }
                ).setRequired(true)
        )
        .setName("rank")
        .setDescription("Shows global rank.");

    static async execute(interaction: CommandInteraction<CacheType>) {

        const embed = new EmbedBuilder().setTitle(":trophy: Melhores jogadores :trophy:").setColor(Colors.Red);

        let players: Player[] = [];
        
        const { value: target } = interaction.options.get("target");
        
        if (target === "global"){
            players = (await Player.findAll({ order: [['score', 'DESC']] })).slice(0, 10);
        }
        
        if (target === "local") {
            const guildPlayers = (await Guild.findOne({ where: { guildId: interaction.guildId } })).players.slice(0, 10);
            await Promise.all(guildPlayers.map(async (userId) => {
                
                const guildPlayer = await Player.findOne({ where: { userId } });
                players.push(guildPlayer);
                players.sort((first, next) => first.score > next.score ? -1 : 1);
            }));
        }

        let emojis = [':first_place:', ':second_place:', ':third_place:', '4', '5', '6', '7', '8', '9', '10'];
        let place = 0;
        players.map((player) => {

            const index = players.indexOf(player);
            
            if(player.userId === interaction.user.id) place = index + 1;

            let emoji = emojis[index];

            embed.addFields([
                { name: `${emoji} - ${player.username}`, value: `${player.score} Pontos` }
            ]);
        });

        await interaction.reply({ embeds: [embed], content: `Você está em ${place}° lugar no ranking <@${interaction.user.id}>`, ephemeral: false });
    }

}

