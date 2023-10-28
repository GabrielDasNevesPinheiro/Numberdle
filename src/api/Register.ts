import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import SetChannel from './commands/SetChannel';
import GameRules from './commands/GameRules';
import Rank from './commands/Rank';
import NextNumber from './commands/NextNumber';
import Play from './commands/Play';
import PlayerScore from './commands/PlayerScore';
import SetName from './commands/SetName';
import RollStore from './commands/RollStore';
import Store from './commands/Store';
import Buffs from './commands/Buffs';
import AllBuffs from './commands/AllBuffs';


config();

const token = process.env.TOKEN as string;
const client_id = process.env.CLIENT_ID as string;

const rest = new REST({ version: '10' }).setToken(token);

const commands = [
    SetChannel.command.toJSON(),
    GameRules.command.toJSON(),
    Rank.command.toJSON(),
    NextNumber.command.toJSON(),
    Play.command.toJSON(),
    PlayerScore.command.toJSON(),
    SetName.command.toJSON(),
    RollStore.command.toJSON(),
    Store.command.toJSON(),
    Buffs.command.toJSON(),
    AllBuffs.command.toJSON()
];


export default function postSlashCommands() {

    try {

        console.log("UPDATING SLASH COMMANDS...");

        rest.put(Routes.applicationCommands(client_id), { body: commands });

        console.log("DONE, MY ROOSTER.");

    } catch (error) {

        console.log(`Error while registering slash commands: ${error}`);

    }
}

export { commands as CommandsArray }