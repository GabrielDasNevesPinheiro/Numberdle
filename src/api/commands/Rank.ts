import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Player from "../../database/Models/Player";

export default abstract class Rank extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Shows global rank.");
    
    static async execute(interaction: CommandInteraction<CacheType>) {

        const embed = new EmbedBuilder().setTitle(":trophy: Melhores jogadores :trophy:").setColor(Colors.Red);

        const players = (await Player.findAll({ order: [['score', 'DESC']]})).slice(0, 10);

        players.map((player) => {

            const index = players.indexOf(player) + 1;
            let emoji = `${index}`;
            if (index == 1) emoji = ':first_place:' 
            if (index == 2) emoji = ':second_place:' 
            if (index == 3) emoji = ':third_place:' 

            embed.addFields([
                { name: `${emoji} - ${player.username}`, value: `${player.score} Pontos` }
            ])
        })

        await interaction.reply({ embeds: [embed], content: "Veja a seguir o ranking", ephemeral: true });
    }

}

