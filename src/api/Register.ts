import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { config } from 'dotenv';
import { commands as cmdList } from '../handlers/InteractionHandler';

config();

const token = process.env.TOKEN as string;
const client_id = process.env.CLIENT_ID as string;

const rest = new REST({ version: '10' }).setToken(token);

let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (let cmd in cmdList) {

    if(cmd !== "announce")
        commands.push(cmdList[cmd].command.toJSON());
}


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