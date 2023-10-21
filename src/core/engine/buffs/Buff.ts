import { Attributes } from "../enum/Attributes";
import { Rarity } from "../enum/Rarity";


interface Initializer {
    name: string
    price: number
    description: string
    rarity: Rarity
    targets: Attributes[]
    apply: (userId: string) => void
}

export default class Buff {

    private _name: string;
    private _price: number;
    private _description: string;
    private _rarity: Rarity;
    private _targets: Attributes[];
    private _apply: (userId: string) => void;


    constructor(data: Initializer) {

        const { name, price, description, rarity, targets, apply } = data;

        this.name = name;
        this.price = price;
        this.description = description;
        this.rarity = rarity;
        this.targets = targets;
        this.apply = apply;

    }

    public isCompatible(others: Buff[]): boolean {

        for (let selectedBuff of others) {
            if (this.targets.some(target => selectedBuff.targets.includes(target))) {
                return false;
            }
        }
        return true;

    }

    // GETTERS & SETTERS
    public get name(): string | undefined {
        return this._name;
    }

    private set name(value: string | undefined) {
        this._name = value;
    }

    public get description(): string | undefined {
        return this._description;
    }

    private set description(value: string | undefined) {
        this._description = value;
    }

    public get rarity(): Rarity | undefined {
        return this._rarity;
    }

    private set rarity(value: Rarity | undefined) {
        this._rarity = value;
    }

    public get targets(): Attributes[] | undefined {
        return this._targets;
    }

    private set targets(value: Attributes[] | undefined) {
        this._targets = value;
    }

    public get apply(): (userId: string) => void {
      return this._apply;
    }
    private set apply(value: (userId: string) => void) {
      this._apply = value;
    }

    public get price(): number {
      return this._price;
    }
    private set price(value: number) {
      this._price = value;
    }
}