import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import commands from './Commands.js';

config();

const token = process.env.TOKEN;
const client_id = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

try {
    
    console.log("UPDATING SLASH COMMANDS...");

    await rest.put(Routes.applicationGuildCommands(client_id, "1075120850241605772"), { body: commands });

    console.log("DONE, MY ROOSTER.");

} catch (error) {

    console.log(`Error while registering slash commands: ${error}`);

}