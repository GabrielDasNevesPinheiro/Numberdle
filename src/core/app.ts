import { ChannelType, Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";
import sequelize from "../database/Connection";
import Guild from "../database/Models/Guild";
import { applyGameLogic, isValidMessage } from "./utils/Utils";
import postSlashCommands, { CommandsArray } from "../api/Register";
import { createDjsClient } from "discordbotlist";
import Player from "../database/Models/Player";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', async () => {
    await sequelize.authenticate();
    await sequelize.sync();
    
    const dbl = createDjsClient(process.env.DBL, client);
    dbl.startPosting();
    dbl.postBotCommands(CommandsArray);
    dbl.startPolling();
    dbl.on("vote", async (vote, client) => {
        
        const player = await Player.findOne({ where: { userId: vote.id }});

        if(player) {
            player.score += 150;
            await player.save();
        }

        console.log(`VOTE EVENT[${vote.username}]`);
    });

    console.log(`Running... ${client.user?.tag}`);

});

client.on('guildCreate', async (guild) => {

    const mainTextChannel = (await guild.channels.fetch()).filter((channel) => channel.type == ChannelType.GuildText).first();

    await Guild.create({
        guildId: guild.id,
        defaultChannel: mainTextChannel.id
    });

    client.users.send(guild.ownerId, "Obrigado por me adicionar em seu servidor, para me configurar basta definir um canal padrão para mim utilizando /setchannel em seu servidor! :)");

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    executeAction(interaction.commandName, interaction);

});

client.on('messageCreate', async (message) => {

    if (!(await isValidMessage(message, client.user.id))) return;

    const guess = Number(message.content);
    applyGameLogic(message, guess);

});


postSlashCommands();
client.login(process.env.TOKEN);