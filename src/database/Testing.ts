import { commands } from "../handlers/InteractionHandler";
import sequelize from "./Connection";
import Guild from "./Models/Guild";


async function test() {
        
    await sequelize.authenticate();
    await sequelize.sync();

    const guilds = await Guild.findAll();

    guilds.map((guild) => {
        console.log(guild.defaultChannel, guild.guildId);
    });
    
    console.log("Connected.");
}

try {   
    
    console.log(commands);

} catch (error) {
    console.log(`Error while connecting ${error}`);
}