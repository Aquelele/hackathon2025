// place files you want to import through the `$lib` alias in this folder.
import { GameState } from "./GameState";
export class GameManager {


    score: number = 0;
    timeLeft: number;
    element: HTMLDivElement | undefined;

    isrolling: boolean = false;

    state: GameState = GameState.NOT_STARTED;



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

    startGame() {
        this.state = GameState.RUNNING;
        console.log("Game Started");
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