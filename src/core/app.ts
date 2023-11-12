import { ActivityType, ChannelType, Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";
import sequelize from "../database/Connection";
import { applyGameLogic, isValidMessage } from "./utils/Utils";
import postSlashCommands, { CommandsArray } from "../api/Register";
import { createGuild, getGuildById } from "../database/Controllers/GuildController";
import { createDjsClient } from "discordbotlist";
import { getPlayerById, getPlayers } from "../database/Controllers/PlayerController";
import Guild from "../database/Models/Guild";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.on('ready', async () => {
    await sequelize.authenticate();
    await sequelize.sync();

    client.user.setActivity({
        name: "Ganhe pontos votando",
        state: "",
        type: ActivityType.Custom,
        url: 'https://discord.ly/numberdle'
    });

    const dbl = createDjsClient(process.env.DBL, client);
    dbl.startPosting();
    dbl.postBotCommands(CommandsArray);
    dbl.startPolling();
    dbl.on("vote", async (vote, client) => {

        const player = await getPlayerById(vote.id);

        if (player) {
            player.score += 150;
            await player.save();
        }

        console.log(`VOTE EVENT[${vote.username}]`);
    });

    console.log(`Running... ${client.user?.tag}`);

});

client.on('guildCreate', async (guild) => {

    const mainTextChannel = (await guild.channels.fetch()).filter((channel) => channel.type == ChannelType.GuildText).first();
    await createGuild(mainTextChannel.id, guild.id);
    client.users.send(guild.ownerId, "Obrigado por me adicionar em seu servidor, para me configurar basta definir um canal padrão para mim utilizando /setchannel em seu servidor! :)");

});

client.on('guildDelete', async (guild) => {

    let server = await getGuildById(guild.id);
    await server?.destroy();

});

client.on('guildMemberRemove', async (member) => {

    let server = await getGuildById(member.guild.id);
    let players = server.players.filter((userId) => userId !== member.id);
    await Guild.update({ players: players }, { where: { guildId: member.guild.id } });

});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel) {
        await interaction.reply("?");
        return;
    }

    executeAction(interaction.commandName, interaction);

});

client.on('messageCreate', async (message) => {

    if (!(await isValidMessage(message, client.user.id))) return;

    const guess = Number(message.content);
    applyGameLogic(message, guess);

});


postSlashCommands();
client.login(process.env.TOKEN);
