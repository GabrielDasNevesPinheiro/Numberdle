import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Running... ${client.user?.tag}`);
});

client.on('guildCreate', (guild) => {

    client.users.send(guild.ownerId, "Obrigado por me adicionar em seu servidor, para me configurar basta definir um canal padrão para mim utilizando /setchannel em seu servidor! :)");

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    executeAction(interaction.commandName, interaction);
});

client.login(process.env.TOKEN);