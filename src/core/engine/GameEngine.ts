
export default class GameEngine {
    

    public score_multiplier = 100;
    public max_attempts = 10;
    public cooldown = 24; // hours
    public tip_attempt = 3; // by attempts left
    public tip_range = 0;

    public generateNumberdle() {
        const number = Math.floor(Math.random() * 1000);
        return number;
    }

    public buildTipMessage(random_number: number, adittional?: string, overwrite?: string) {

        if (overwrite) {
            return overwrite;
        }

        let tip = "";

        if(this.tip_range == 0) {

            let len = random_number.toString().length - 1;
            let toSub = Number(random_number.toString()[len]);
    
            const minRange = random_number - toSub;
            const maxRange = (random_number + 10) - toSub;
    
            tip = `Você tem só mais 3 tentativas! Seu número está entre ${minRange} e ${maxRange}`;
        
        }

        if (this.tip_range > 0) {
            const minRange = random_number - this.tip_range;
            const maxRange = random_number + this.tip_range;
            tip = `Você tem só mais 3 tentativas! Seu número está entre ${minRange} e ${maxRange}`;
        } 

        if (adittional) {
            tip += `\n${adittional}`
        }

    }
}