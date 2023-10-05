import { CacheType, CommandInteraction, Interaction } from "discord.js";
import GameRules from "../api/commands/GameRules";
import NextNumber from "../api/commands/NextNumber";
import Rank from "../api/commands/Rank";
import SetChannel from "../api/commands/SetChannel";
import Command from "../api/commands/Command";
import Play from "../api/commands/Play";
import PlayerScore from "../api/commands/PlayerScore";
import SetName from "../api/commands/SetName";


let commands: { [key: string]: typeof Command } = {
    "gamerules": GameRules,
    "nextnumber": NextNumber,
    "rank": Rank,
    "setchannel": SetChannel,
    "play": Play,
    "player": PlayerScore,
    "setname": SetName
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}