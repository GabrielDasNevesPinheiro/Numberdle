import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getTimeDiff, getTodayDate } from "../../core/utils/Utils";
import { addGuildPlayer, getGuildById, getGuildDefaultChannel } from "../../database/Controllers/GuildController";
import { createPlayer, getPlayerById } from "../../database/Controllers/PlayerController";
import GameEngine from "../../core/engine/GameEngine";
import { Playing } from "../../core/engine/Playing";

export default abstract class Play extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("play")
        .setDescription("Inicia um Numberdle")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        const defaultChannel = await getGuildDefaultChannel(interaction.guildId);

        let player = await getPlayerById(interaction.user.id);

        const guild = await getGuildById(interaction.guildId);

        if (interaction.channelId !== defaultChannel) return;

        if (!player) {
            player = await createPlayer(interaction.user.id, 0, interaction.user.username);
        }

        if (!guild.players.includes(player.userId)) {
            await addGuildPlayer(guild.guildId, player.userId);
        }

        if (Playing.inGame[player.userId]) {
            await interaction.editReply({ content: "Você já está em jogo :p" });
            return;
        }

        const timeDiff = getTimeDiff(player?.lastPlayed);

        if (!(timeDiff >= 24)) {
            return await interaction.editReply({ content: `Você poderá jogar em ${24 - timeDiff} horas` });
        }
        
        await interaction.editReply({ content: "Hmmmmm" });

        const engine = new GameEngine();
        //here must have buff checker, something like that

        const number = engine.generateNumberdle();

        Playing.inGame[player.userId] = { attempts: 10, generatedNumber: number, playerEngine: engine }

        await interaction.editReply({ content: `Advinhe o seu número entre 0 e 1000 em até ${Playing.inGame[player.userId].attempts} chances!` });

    }
}