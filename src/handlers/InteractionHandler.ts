import { CacheType, Interaction } from "discord.js";
import GameRules from "../api/commands/GameRules";
import LocalRank from "../api/commands/LocalRank";
import NextNumber from "../api/commands/NextNumber";
import Rank from "../api/commands/Rank";
import SetChannel from "../api/commands/SetChannel";


let commands = {
    "gamerules": GameRules,
    "localrank": LocalRank,
    "nextnumber": NextNumber,
    "rank": Rank,
    "setchannel": SetChannel
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction);
}