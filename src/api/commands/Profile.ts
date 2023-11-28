import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { Canvas, CanvasRenderingContext2D, loadImage } from "canvas";
import { getPlayerById, getPlayers } from "../../database/Controllers/PlayerController";
import { loadImageURL } from "../../core/utils/ImageUtils";
import Game from "../../database/Models/Game";
import { getMostFrequentElement } from "../../core/utils/Utils";

let cooldown = false;

export default abstract class Profile extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("profile")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário alvo")
        )
        .setDescription("Exibe o perfil de algum jogador")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let user = interaction.options.getUser("user") ?? interaction.user;

        let player = await getPlayerById(user.id);

        if (!player) return await interaction.editReply({ content: `Este usuário não jogou Numberdle :()` });
        
        let rankIndex = (await getPlayers()).reduce((prev, curr, index) => curr.userId === user.id ? index + 1 : prev, 0);

        let data = await Game.findAll({ where: { userId: user.id }});
        let wins = data.filter(game => game.win).length;
        let loss = data.filter(game => !game.win).length;
        let winrate = (wins / (wins + loss) * 100)
        let guilds = data.map((game) => game.guildId);
        let guild = interaction.client.guilds.cache.get(getMostFrequentElement(guilds));
        
        let info: playerInfo = {
            userId: player.userId,
            username: player.username,
            description: `${player?.description ?? "Olá, eu amo Numberdle. (/description)"}`,
            multiplier: `${player.multiplier}x`,
            rank: `${rankIndex}°`,
            winrate: `${winrate.toFixed(0)}%`,
            score: `${player.score.toLocaleString("pt-BR")}`,
            server: `${guild?.name ?? "Não encontrado"}`
        };
        let image = await getProfileImage(user.displayAvatarURL({ size: 128, extension: "png" }), info);


        if(cooldown) {
            return await interaction.editReply({ content: `Ops, tenta novamente...` });
        }
        await interaction.editReply({ files: [image] });
        
        cooldown = true;
        setTimeout(() => { cooldown = false}, 5000);

    }

}

type playerInfo = {
    userId: string
    username: string,
    description: string,
    score: string,
    multiplier: string,
    winrate: string,
    rank: string,
    server: string
}

async function getProfileImage(avatarURL: string, info: playerInfo): Promise<Buffer> {

    let donators = ["340933138039439360", "446425424680058915", "302419010803335169", "846797955134390282"];
    
    const canva = new Canvas(542, 642);
    const ctx: CanvasRenderingContext2D = canva.getContext("2d");
    ctx.drawImage(await loadImageURL(avatarURL), 208, 30, 114, 114);

    const positions = {
        "username": { w: 526, h: 36, x: 8, y: 139 },
        "description": { w: 526, h: 40, x: 8, y: 210 },
        "score": { w: 239, h: 42, x: 25, y: 256 },
        "multiplier": { w: 239, h: 42, x: 271, y: 256 },
        "rank": { w: 67, h: 33, x: 46, y: 550 },
        "winrate": { w: 79, h: 33, x: 231, y: 552 },
        "server": { w: 162, h: 70, x: 369, y: 565 },
        "crown": { w: 60, h: 34, x: 235, y: 0 },
        "coin": { w: 33, h: 33, x: 477, y: 30 }
    }

    let background = await loadImage("./src/assets/profile.png");
    ctx.drawImage(background, 0, 0);
    

    ctx.fillStyle = "#FFF";

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(info.username, 264, 164);

    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(info.description, 264, 215);
    
    let pos = positions.score;
    drawTextInBox(ctx, info.score, pos.x, pos.y, pos.w, pos.h, 30);
    
    pos = positions.multiplier;
    drawTextInBox(ctx, info.multiplier, pos.x, pos.y, pos.w, pos.h, 30);
    
    pos = positions.rank;
    drawTextInBox(ctx, info.rank, pos.x, pos.y, pos.w, pos.h, 30);
    
    pos = positions.winrate;
    drawTextInBox(ctx, info.winrate, pos.x, pos.y, pos.w, pos.h, 30);
    
    pos = positions.server;
    drawTextInBox(ctx, info.server, pos.x, pos.y, pos.w, pos.h, 24);

    if(info.rank === "1°") {
        pos = positions.crown
        let crown = await loadImage("./src/assets/crown.png");
        ctx.drawImage(crown, pos.x, pos.y);
    }

    if(donators.includes(info.userId)) {
        pos = positions.coin;
        let coin = await loadImage("./src/assets/coin.png");
        ctx.drawImage(coin, pos.x, pos.y);
    }

    return canva.toBuffer();

}



function drawTextInBox(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    boxWidth: number,
    boxHeight: number,
    fontsize: number
  ) {
    ctx.font = `${fontsize}px Arial`;
    ctx.textAlign = "center";
    const boxX = x + boxWidth / 2;
    const boxY = y + boxHeight / 2 + fontsize / 2; 
    
    const words = text.split(' ');
    let line = '';
    let testY = boxY - ((words.length - 1) * fontsize) / 2;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
  
      if (testWidth > boxWidth && i > 0) {
        ctx.fillText(line, boxX, testY);
        line = words[i] + ' ';
        testY += fontsize;
      } else {
        line = testLine;
      }
    }
  
    ctx.fillText(line, boxX, testY);
  }