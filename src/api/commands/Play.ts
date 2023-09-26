import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

type GameManager = {
    attempts: number,
    generatedNumber: number,
}

export default abstract class Play extends Command {

    static inGame: { [userId: string]: { info: GameManager }}

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("play")
        .setDescription("Time to play today's Numberdle!")

    static async execute(interaction: CommandInteraction<CacheType>) {

        // check if is Numberdle channel
        // check if player can play(based on lastPlayed date)
        // if player is not on database register.
        // generate player number, between 0 and 1000 and send the info to player
        // register player to inGame variable and his number

    }
}