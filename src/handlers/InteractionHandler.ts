import { CacheType, CommandInteraction, Interaction } from "discord.js";
import GameRules from "../api/commands/GameRules";
import LocalRank from "../api/commands/LocalRank";
import NextNumber from "../api/commands/NextNumber";
import Rank from "../api/commands/Rank";
import SetChannel from "../api/commands/SetChannel";
import Command from "../api/commands/Command";
import Play from "../api/commands/Play";


let commands: { [key: string]: typeof Command } = {
    "gamerules": GameRules,
    "localrank": LocalRank,
    "nextnumber": NextNumber,
    "rank": Rank,
    "setchannel": SetChannel,
    "play": Play,
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}