
export default class GameEngine {


    public score_multiplier = 100;
    public multiplier_gain = 0.1;
    public multiplier_reset = 1.0;
    public max_attempts = 10;
    public tip_attempt = 3; // by attempts left
    public tip_range = 0;

    public generateNumberdle() {
        const number = Math.floor(Math.random() * 1000);
        return number;
    }

    public buildTipMessage(args: { attempts_left: number, random_number: number, adittional?: string, overwrite?: string }) {

        const { attempts_left, adittional, overwrite, random_number } = args;

        if (overwrite) {
            return args.overwrite;
        }

        let tip = "";

        if (this.tip_range == 0) {

            let len = random_number.toString().length - 1;
            let toSub = Number(random_number.toString()[len]);

            const minRange = random_number - toSub;
            const maxRange = (random_number + 10) - toSub;

            tip = `Você tem só mais ${attempts_left} tentativas! Seu número está entre ${minRange} e ${maxRange}`;

        }

        if (this.tip_range > 0) {
            const minRange = random_number - this.tip_range;
            const maxRange = random_number + this.tip_range;
            tip = `Você tem só mais ${attempts_left} tentativas! Seu número está entre ${minRange} e ${maxRange}`;
        }

        if (adittional) {
            tip += `Você tem só mais ${attempts_left} tentativas! ${adittional}`
        }

        return tip;

    }
}