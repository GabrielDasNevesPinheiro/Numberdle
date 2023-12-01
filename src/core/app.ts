import { ActivityType, ChannelType, Client, GatewayIntentBits, Partials, Guild as DiscordGuild } from "discord.js";
import { config } from "dotenv";
import executeAction from "../handlers/InteractionHandler";
import sequelize from "../database/Connection";
import { applyGameLogic, checkVoted, isValidMessage } from "./utils/Utils";
import postSlashCommands from "../api/Register";
import { createGuild, getGuildById } from "../database/Controllers/GuildController";
import { getPlayers } from "../database/Controllers/PlayerController";
import Guild from "../database/Models/Guild";
import { AutoPoster } from "topgg-autoposter";

config();
const environment = process.env.ENVIRONMENT || "prod";
let votedPlayersChecked: { [key: string]: boolean } = {};

const startDatabase = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
}

const setupActivity = async (client: Client) => {
    client.user.setActivity({
        name: "Ganhe pontos votando",
        state: "",
        type: ActivityType.Custom,
        url: 'https://discord.ly/numberdle'
    });
}

const startVoteChecker = async () => {
    setInterval(async () => {
        let players = await getPlayers();
        players.forEach(async (player) => {
            let { voted } = await checkVoted(player.userId);

            if(!voted && votedPlayersChecked[player.userId]) delete votedPlayersChecked[player.userId];
            if (voted && !votedPlayersChecked[player.userId]) player.score += 300;
            await player.save();
            votedPlayersChecked[player.userId] = true;
        });
    }, 120000);
}

const setupTopgg = async(client: Client) => {
    if (environment === "prod") {
        AutoPoster(process.env.TOPGG, client);
        await startVoteChecker();
    }
}

const showGuilds = (guild: DiscordGuild) => console.log(`I'm on the guild => ${guild?.name ?? "Not found"}`);

const configNewGuild = async (guild: DiscordGuild) => {
    const mainTextChannel = (await guild.channels.fetch()).filter((channel) => channel.type == ChannelType.GuildText).first();
    await createGuild(mainTextChannel.id, guild.id);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ], partials: [Partials.Reaction]
});

client.on('ready', async (client) => {

    await startDatabase();
    await setupActivity(client);
    await setupTopgg(client);

    client.guilds.cache.forEach(showGuilds);

    console.log(`Running... ${client.user?.tag}`);

});

client.on('guildCreate', async (guild) => {

    await configNewGuild(guild);
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
