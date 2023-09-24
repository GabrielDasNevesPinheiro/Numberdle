import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Running... ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    interaction.reply("Alright!");
})

client.login(process.env.TOKEN);