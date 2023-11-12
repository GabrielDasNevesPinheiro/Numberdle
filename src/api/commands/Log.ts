import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import Game from "../../database/Models/Game";



class Log extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("log").addUserOption(option => 
        option.setName("user")
        .setDescription("Um usuário para ver as informações")
    ).setDescription("Veja detalhadamente os jogos ou um jogo específico de algum jogador")

    static async execute(interaction: CommandInteraction<CacheType>) {
        
        const userId = interaction.options.getUser("user")?.id;
        let data = await Game.findAll({ where: { userId: userId || interaction.user.id }});      

        
    }
    
}

export default Log;