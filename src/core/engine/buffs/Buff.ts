import { Attributes } from "../enum/Attributes";
import { Rarity } from "../enum/Rarity";


interface Initializer {
    name: string
    description: string
    rarity: Rarity;
    targets: Attributes[];
}

export default class Buff {

    protected _name: string;
    protected _description: string;
    protected _rarity: Rarity;
    protected _targets: Attributes[];
    protected _apply: (userId: string) => void;


    constructor(data: Initializer) {

        const { name, description, rarity, targets } = data;

        this.name = name;
        this.description = description;
        this.rarity = rarity;
        this.targets = targets;

    }

    public isCompatible(other: Buff): boolean {

        const temp = this.targets;

        temp.push(...other.targets);

        let repeated = temp.filter((value, index, array) => array.indexOf(value) !== index);

        return true ? repeated.length == 0 : false;

    }

    // GETTERS & SETTERS
    public get name(): string | undefined {
        return this._name;
    }

    protected set name(value: string | undefined) {
        this._name = value;
    }

    public get description(): string | undefined {
        return this._description;
    }

    protected set description(value: string | undefined) {
        this._description = value;
    }

    public get rarity(): Rarity | undefined {
        return this._rarity;
    }

    protected set rarity(value: Rarity | undefined) {
        this._rarity = value;
    }

    public get targets(): Attributes[] | undefined {
        return this._targets;
    }

    protected set targets(value: Attributes[] | undefined) {
        this._targets = value;
    }

    public get apply(): (userId: string) => void {
      return this._apply;
    }
    public set apply(value: (userId: string) => void) {
      this._apply = value;
    }
}