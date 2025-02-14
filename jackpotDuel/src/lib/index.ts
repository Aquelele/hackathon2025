// place files you want to import through the `$lib` alias in this folder.

export class GameManager {


    score: number = 0;
    timeLeft: number;
    element: HTMLDivElement | undefined;

    isrolling: boolean = false;



    constructor(startTime: number) {
        this.timeLeft = startTime;
        console.log("GameManager created");
    }

    bindElement(element: HTMLDivElement) {
        this.element = element;
    }

    inscreseScore(amount: number) {
        this.score += amount;
        console.log("Score: ", this.score);
    }

    getScore() {
        return this.score;
    }

    async spin() {
        //console.log("Spinning");
        this.isrolling = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.score += Math.floor(Math.random() * 100);
        this.isrolling = false;
        //console.log("Spun");
    }


}