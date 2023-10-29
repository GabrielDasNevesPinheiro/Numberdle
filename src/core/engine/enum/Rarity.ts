import { Colors } from "discord.js";

export enum Rarity {

    NORMAL = 0,
    RARE = 1,
    EPIC = 2,
    IMPOSSIBLE = 3,
}

export const rarities: { [key: number]: { name: string, color: number, image: string }} = {
    
    0: { name: "Normal", color: Colors.Green, image: "https://i.imgur.com/x3z9utF.jpg" },
    1: { name: "Raro", color: Colors.Gold, image: "https://i.imgur.com/0J89wM4.jpg" },
    2: { name: "Épico", color: Colors.Purple, image: "https://i.imgur.com/Wqe95Vz.jpg" }
}