import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";
import { getPlayers } from "../../database/Controllers/PlayerController";
import { getGuildPlayers, getGuildRanking } from "../../database/Controllers/GuildController";

export default abstract class Rank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption((option) =>
            option.setName("target")
                .setDescription("Tipo de ranking a ser consultado")
                .addChoices(
                    { name: "Ranking Global", value: "global" },
                    { name: "Ranking Local", value: "local" },
                    { name: "Ranking de Servidores", value: "servers" }
                ).setRequired(true)
        )
        .setName("rank")
        .setDescription("Mostra o ranking do Numberdle");

    static async execute(interaction: CommandInteraction<CacheType>) {

        let embed = new EmbedBuilder().setTitle(":trophy: Melhores jogadores :trophy:").setColor(Colors.Red);

        let players: Player[] = [];
        let guildRanking: { guildId: string, score: number }[] = [];
        
        const { value: target } = interaction.options.get("target");
        
        if (target === "global"){
            players = (await getPlayers());
        }
        
        if (target === "local") {
            players = await getGuildPlayers(interaction.guildId);
        }

        if (target === "servers") {
            
            guildRanking = await getGuildRanking();
            guildRanking.sort((first, sec) => first.score > sec.score ? -1 : 1);
            embed = embed.setTitle(":trophy: Melhores Servidores :trophy:")
            
        
        }

        let emojis = [':first_place:', ':second_place:', ':third_place:', '4', '5', '6', '7', '8', '9', '10'];

        if (!(target === "servers")) {

            let place = 0;
            players.slice(0,10).map((player, index) => {
                
                if(player.userId === interaction.user.id) place = index + 1;
    
                let emoji = emojis[index];
    
                embed.addFields([
                    { name: `${emoji} - ${player.username}`, value: `${player.score} Pontos` }
                ]);
            });

            await interaction.reply({ embeds: [embed], content: `Você está em ${place}° lugar no ranking <@${interaction.user.id}>`, ephemeral: false });
        
        } else {

            let place = 0;

            guildRanking.forEach((guildRank, index) => {      
                
                const {guildId, score} = guildRank;         
                
                let name = interaction.client.guilds.cache.get(guildId)?.name;
                console.log(name, guildId, guildRanking.indexOf({guildId, score}));
                if(!name) return;

                
                let emoji = emojis[index];

                if(guildId === interaction.guildId) place = index + 1;

                embed.addFields([
                    { name: `${emoji} - ${name}`, value: `${score.toLocaleString("pt-BR")} Pontos` }
                ]);
                
            });

            await interaction.reply({ embeds: [embed], content: `Este server está em ${place}° lugar no ranking <@${interaction.user.id}>`, ephemeral: false });
            
        }


    }

}

