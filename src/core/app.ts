import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";
import sequelize from "../database/Connection";
import Guild from "../database/Models/Guild";
import Play from "../api/commands/Play";

config();

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

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

client.on('messageCreate', async (message) => {

    if(message.author.id === client.user.id) return;

    const { defaultChannel } = await Guild.findOne({ where: { guildId: message.guildId }});

    if(message.channelId !== defaultChannel) return; // dont answer if is not Numberdle's channel
    
    if(!Play.inGame[message.author.id]) { // if true, player is not playing Numberdle yet to guess his number
        message.react('🤡');
        return;
    };

    if(Number.isNaN(Number(message.content))) { // check if is not a numeric string
        message.react('💀');
        return;
    }

});

client.login(process.env.TOKEN);