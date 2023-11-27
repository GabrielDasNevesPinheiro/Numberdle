import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";
import path from "path";
import fs from "fs";


export const commands: { [key: string]: typeof Command } = parseSlashCommands();

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}

function parseSlashCommands (): { [key: string]: typeof Command } {
    const comandos: { [key: string]: typeof Command } = {};

    
    const diretorioComandos = path.join(__dirname, "../api/commands");

    const arquivos = fs.readdirSync(diretorioComandos);

    arquivos.forEach((arquivo) => {
        if (arquivo.endsWith(".js") || arquivo.endsWith(".ts")) {
            const comando = require(path.join(diretorioComandos, arquivo)).default;

            if (comando.command && typeof comando.execute === "function") {
                comandos[comando.command.name] = comando;
            }
        }
    });

    return comandos;
}