import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";
import sequelize from "../database/Connection";
import Guild from "../database/Models/Guild";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
    console.log(`Running... ${client.user?.tag}`);
    await sequelize.authenticate();
    await sequelize.sync();
});

client.on('guildCreate', async (guild) => {

    await Guild.create({
        guildId: guild.id,
        defaultChannel: null
    });
    
    client.users.send(guild.ownerId, "Obrigado por me adicionar em seu servidor, para me configurar basta definir um canal padrão para mim utilizando /setchannel em seu servidor! :)");

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    executeAction(interaction.commandName, interaction);
});

client.login(process.env.TOKEN);