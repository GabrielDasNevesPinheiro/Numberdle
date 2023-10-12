import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";
import { getPlayers } from "../../database/Controllers/PlayerController";
import { getGuildPlayers } from "../../database/Controllers/GuildController";

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
        .setDescription("Mostra o ranking do Numberdle");

    static async execute(interaction: CommandInteraction<CacheType>) {

        const embed = new EmbedBuilder().setTitle(":trophy: Melhores jogadores :trophy:").setColor(Colors.Red);

        let players: Player[] = [];
        
        const { value: target } = interaction.options.get("target");
        
        if (target === "global"){
            players = (await getPlayers()).slice(0, 10);
        }
        
        if (target === "local") {
            players = await getGuildPlayers(interaction.guildId);
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

