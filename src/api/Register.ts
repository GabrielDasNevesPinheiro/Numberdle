import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import SetChannel from './commands/SetChannel';
import GameRules from './commands/GameRules';
import LocalRank from './commands/LocalRank';
import Rank from './commands/Rank';
import NextNumber from './commands/NextNumber';


config();

const token = process.env.TOKEN as string;
const client_id = process.env.CLIENT_ID as string;  

const rest = new REST({ version: '10' }).setToken(token);

const commands = [
    SetChannel.command.toJSON(),
    GameRules.command.toJSON(),
    LocalRank.command.toJSON(),
    Rank.command.toJSON(),
    NextNumber.command.toJSON()
];


try {
    
    console.log("UPDATING SLASH COMMANDS...");

    rest.put(Routes.applicationGuildCommands(client_id, "1075120850241605772"), { body: commands });

    console.log("DONE, MY ROOSTER.");

} catch (error) {

    console.log(`Error while registering slash commands: ${error}`);

}